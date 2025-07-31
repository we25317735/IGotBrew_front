import axios from 'axios'
import 'dotenv/config.js'

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACK_API}/article`

let articles = []

const api = {
  getAllArticles: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/list`)
      articles = response.data
      return articles
    } catch (error) {
      console.error('Failed to fetch articles:', error.message)
      throw error
    }
  },

  searchArticles: async (keyword) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/search?keyword=${keyword}`
      )
      articles = response.data
      return articles
    } catch (error) {
      console.error(
        `Failed to search articles with keyword "${keyword}":`,
        error.message
      )
      throw error
    }
  },

  getArticle: async (id) => {
    console.log('ap: ', `${API_BASE_URL}/${id}`)
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`)
      return response.data
    } catch (error) {
      console.error(`Failed to fetch article ${id}:`, error.message)
      throw error
    }
  },

  publishArticle: async (articleData) => {
    console.log(articleData)
    try {
      const response = await axios.post(
        `${API_BASE_URL}/publish`,
        articleData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      console.log('Server response:', response.data)
      return response.data
    } catch (error) {
      console.error('Failed to create article:', error)
      if (error.response) {
        console.error('Response status:', error.response.status)
        console.error('Response data:', error.response.data)
      } else if (error.request) {
        console.error('No response received:', error.request)
      } else {
        console.error('Error details:', error.message)
      }
      throw error
    }
  },

  updateArticle: async (id, articleData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/${id}/edit`,
        articleData
      )
      console.log(response)
      const updatedArticle = response.data.article

      return updatedArticle
    } catch (error) {
      console.error(`Failed to update article ${id}:`, error.message)
      throw error
    }
  },

  deleteArticle: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${id}`)

      if (response.status === 200 || response.status === 204) {
        return true
      } else {
        console.error(
          `Failed to mark article ${id} as deleted:`,
          response.statusText
        )
        return false
      }
    } catch (error) {
      console.error(`Failed to delete article ${id}:`, error.message)
      throw error
    }
  },
  getUserById: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/${userId}`)
      return response.data
    } catch (error) {
      console.error(`Failed to fetch user with ID ${userId}:`, error.message)
      throw error
    }
  },

  getComments: async (articleId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/comments/${articleId}`)
      return response.data
    } catch (error) {
      console.error(
        `Failed to fetch comments for article ${articleId}:`,
        error.message
      )
      throw error
    }
  },

  addComment: async (articleId, userId, content) => {
    console.log('content:', content, 'userId:', userId)
    try {
      const response = await axios.post(
        `${API_BASE_URL}/${articleId}/comments`,
        { userId, content },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data
    } catch (error) {
      console.error('Failed to add comment:', error.message)
      throw error
    }
  },
  deleteComment: async (commentId, userId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/comments/${commentId}`,
        {
          params: { userId },
        }
      )
      if (response.status === 200 || response.status === 204) {
        return true
      } else {
        console.error(
          `Failed to delete comment ${commentId}:`,
          response.statusText
        )
        return false
      }
    } catch (error) {
      console.error(`Failed to delete comment ${commentId}:`, error.message)
      throw error
    }
  },

  addReply: async (commentId, content, userId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/replies`,
        { commentId, content, userId },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data
    } catch (error) {
      console.error('Failed to add reply:', error.message)
      throw error
    }
  },

  deleteReply: async (replyId, userId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/replies/${replyId}`,
        {
          params: { userId },
        }
      )
      if (response.status === 200 || response.status === 204) {
        return true
      } else {
        console.error(`Failed to delete reply ${replyId}:`, response.statusText)
        return false
      }
    } catch (error) {
      console.error(`Failed to delete reply ${replyId}:`, error.message)
      throw error
    }
  },

  toggleLike: async (user_id, target_type, target_id) => {
    console.log({ user_id, target_type, target_id })
    try {
      const response = await axios.post(
        `${API_BASE_URL}/likes`,
        { user_id, target_type, target_id },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data
    } catch (error) {
      console.error(
        `Failed to toggle like for ${target_type} ${target_id}:`,
        error.message
      )
      throw error
    }
  },
  getArticleLikes: async (articleId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${articleId}/likes`)
      return response.data
    } catch (error) {
      console.error(
        `Failed to fetch likes for article ${articleId}:`,
        error.message
      )
      throw error
    }
  },
  checkUserLikeStatus: async (articleId, userId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/${articleId}/like-status`,
        {
          params: { userId },
        }
      )
      return response.data
    } catch (error) {
      console.error(
        `Failed to check like status for article ${articleId}:`,
        error.message
      )
      throw error
    }
  },
}

export default api
