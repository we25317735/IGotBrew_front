import axios from 'axios'

const api = {
  getCafesData: async () => {
    try {
      const response = await axios.get('/api/cafes')
      console.log(response)
      return response.data
    } catch (error) {
      console.error('Error fetching cafes data:', error)
      return []
    }
  },

  getCafesByCity: async (city) => {
    try {
      const response = await axios.get(`/api/cafes/${city}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching cafes data for ${city}:`, error)
      return []
    }
  },

  getFilteredCafes: async (filters) => {
    try {
      const validFilters = {}
      Object.keys(filters).forEach((key) => {
        if (filters[key] && filters[key] !== '不限') {
          validFilters[key] = filters[key]
        }
      })

      const response = await axios.get('/api/cafes', { params: validFilters })
      return response.data
    } catch (error) {
      console.error('Error fetching filtered cafes data:', error)
      return []
    }
  },
}

export default api
