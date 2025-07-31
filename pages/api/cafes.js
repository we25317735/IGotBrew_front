// pages/api/cafes.js
import axios from 'axios'

export default async function handler(req, res) {
  try {
    const response = await axios.get('https://cafenomad.tw/api/v1.2/cafes')
    res.status(200).json(response.data)
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json({ error: 'Failed to fetch data' })
  }
}
