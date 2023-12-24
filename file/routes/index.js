var express = require('express');
var router = express.Router();
const { default: Axios } = require('axios');
const fs = require('fs');
const path = require('path');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

const prefix = {
  "dynamic-routing": `---
title: 'Dynamic Routing and Static Generation'
excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. At imperdiet dui accumsan sit amet nulla facilities morbi tempus.'
coverImage: '/assets/blog/dynamic-routing/cover.jpg'
date: '2020-03-16T05:35:07.322Z'
author:
  name: JJ Kasper
  picture: '/assets/blog/authors/jj.jpeg'
ogImage:
  url: '/assets/blog/dynamic-routing/cover.jpg'
---

`,
  "hello-world": `---
title: 'Learn How to Pre-render Pages Using Static Generation with Next.js'
excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. At imperdiet dui accumsan sit amet nulla facilities morbi tempus.'
coverImage: '/assets/blog/hello-world/cover.jpg'
date: '2020-03-16T05:35:07.322Z'
author:
  name: Tim Neutkens
  picture: '/assets/blog/authors/tim.jpeg'
ogImage:
  url: '/assets/blog/hello-world/cover.jpg'
---

`,
  "preview": `---
title: 'Preview Mode for Static Generation'
excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. At imperdiet dui accumsan sit amet nulla facilities morbi tempus.'
coverImage: '/assets/blog/preview/cover.jpg'
date: '2020-03-16T05:35:07.322Z'
author:
  name: Joe Haddad
  picture: '/assets/blog/authors/joe.jpeg'
ogImage:
  url: '/assets/blog/preview/cover.jpg'
---

`,
  "test": `---
title: '测试 isc title'
excerpt: '测试 isc excerpt'
coverImage: '/assets/blog/dynamic-routing/cover.jpg'
date: '2020-03-16T05:35:07.322Z'
author:
  name: JJ Kasper
  picture: '/assets/blog/authors/jj.jpeg'
ogImage:
  url: '/assets/blog/dynamic-routing/cover.jpg'
---

`,
}

/* GET home page. */
router.post('/save', function (req, res, next) {
  const saveedData = req.body; // 获取上传的内容较多的字符串
  const baseContent = saveedData.data;
  fs.writeFile('./public/_posts/test.md', baseContent, async (err) => {
    if (err) {
      console.error('保存文件时发生错误：', err);
      res.send("保存失败");
      return;
    }
    console.log('文件保存成功！');
    //更新缓存 isc
    // const result = await Axios.get("http://localhost:3000/api/doc");
    // console.log(`isc更新：`, result.data);
    res.send("保存成功");
  });
});

function readFilesInFolder(folderPath) {
  const files = fs.readdirSync(folderPath);
  const result = [];

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);
    if (stats.isFile()) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const fileData = {
        fileName: file.replace(".md", ""),
        fileContent: prefix[file.replace(".md", "")] + fileContent
      };
      result.push(fileData);
    } else if (stats.isDirectory()) {
      const subFolderFiles = readFilesInFolder(filePath);
      result.push(...subFolderFiles);
    }
  });

  return result;
}

router.get('/posts', function (req, res, next) {
  const folderPath = './public/_posts/';
  const post = readFilesInFolder(folderPath);
  res.send(post);
});

module.exports = router;
