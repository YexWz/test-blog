// import fs from 'fs'
// import { join } from 'path'
// import matter from 'gray-matter'

// const postsDirectory = join(process.cwd(), '_posts')

// export function getPostSlugs() {
//   return fs.readdirSync(postsDirectory)
// }

// export  function getPostBySlug(slug: string, fields: string[] = []) {
//   const realSlug = slug.replace(/\.md$/, '')
//   const fullPath = join(postsDirectory, `${realSlug}.md`)
//   const fileContents = fs.readFileSync(fullPath, 'utf8')
//   const { data, content } = matter(fileContents)

//   type Items = {
//     [key: string]: string
//   }

//   const items: Items = {}

//   // Ensure only the minimal needed data is exposed
//   fields.forEach((field) => {
//     if (field === 'slug') {
//       items[field] = realSlug
//     }
//     if (field === 'content') {
//       items[field] = content
//     }

//     if (typeof data[field] !== 'undefined') {
//       items[field] = data[field]
//     }
//   })

//   return items
// }

// export function getAllPosts(fields: string[] = []) {
//   const slugs = getPostSlugs();
//   console.log("slugs",slugs);
//   const posts = slugs
//     .map((slug) => getPostBySlug(slug, fields))
//     // sort posts by date in descending order
//     .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
//   console.log("posts",JSON.stringify(posts));
//   return posts
// }


import matter from 'gray-matter'



export async function getPostSlugs() {
  const res = await fetch(
    `http://localhost:3001/posts`
  ).then(res => res.json());
  return res.map(m => {
    return m.fileName ;
  })
}

export async function getPostBySlug(slug: string, fields: string[] = []) {
  const res = await fetch(
    `http://localhost:3001/posts`
  ).then(res => res.json());
  const fileContents = (res.find(m => m.fileName === slug))?.fileContent || "";

  const { data, content } = matter(fileContents)

  type Items = {
    [key: string]: string
  }

  const items: Items = {}

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = slug
    }
    if (field === 'content') {
      items[field] = content
    }

    if (typeof data[field] !== 'undefined') {
      items[field] = data[field]
    }
  })

  return items
}

export async function getAllPosts(fields: string[] = []) {
  const slugs =await getPostSlugs();
  const posts =(await Promise.all( slugs
    .map((slug) => getPostBySlug(slug, fields))
    // sort posts by date in descending order
    )).sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts
}
