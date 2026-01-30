import { getReviewsByProductId } from "@/database/queries";


export default async function handler(req, res) {
  const { productId, page = 1, limit = 5 } = req.query;

  if (!productId) return res.status(400).json({ message: "Missing productId" });

  const reviews = await getReviewsByProductId({ 
    productId, 
    limit: parseInt(limit), 
    skip: (page - 1) * limit 
  });

  res.status(200).json({ reviews });
}
