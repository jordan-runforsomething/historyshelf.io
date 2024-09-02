/** This route processes new books
 * If a book ID is passed in request.body.book_id then we only process that one book
 */

import type { NextApiRequest, NextApiResponse } from "next"

type ResponseData = {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json({ message: "Hello from Next.js!" })
}

export const config = {
  // Specifies the maximum allowed duration for this function to execute (in seconds)
  maxDuration: 60,
}
