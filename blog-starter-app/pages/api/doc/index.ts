
import type { NextApiRequest, NextApiResponse } from 'next'
type ResponseData = {
  code: number
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
   const { slug } = req.query
   res.revalidate(`/posts/${slug||"test"}`);
   res.status(200).json({
    code: 200,
  });
}
