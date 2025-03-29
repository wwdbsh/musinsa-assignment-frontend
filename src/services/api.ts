import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 고객용 API 함수
export const getCategorySummary = () => api.get('/summary/category');
export const getLowestBrandPurchase = () => api.get('/summary/brand');
export const getCategoryPriceRange = (category: string) => api.get(`/summary/category/${category}`);
export const getCategories = () => api.get('/summary/categories');

// 운영자용 API 함수
export const createBrand = (brandData: any) => api.post('/admin/brands', brandData);
export const updateBrand = (id: number, brandData: any) => api.put(`/admin/brands/${id}`, brandData);
export const deleteBrand = (id: number) => api.delete(`/admin/brands/${id}`);
export const getBrandIdByName = (name: string) => api.get(`/admin/brands/name/${name}`);

export default api;