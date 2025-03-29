import React, { useEffect, useState } from 'react';
import { 
  getCategorySummary, 
  getLowestBrandPurchase, 
  getCategoryPriceRange, 
  getCategories 
} from '../services/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"

interface CategorySummaryItem {
  category: string;
  brand: string;
  price: number;
}

interface CategorySummaryResponse {
  items: CategorySummaryItem[];
  total: number;
}

interface PriceDetail {
  brand: string;
  price: number;
}

interface CategoryPriceRangeResponse {
  category: string;
  lowestPrice: PriceDetail[];
  highestPrice: PriceDetail[];
}

interface LowestBrandPurchaseResponse {
  brand: string;
  category: { category: string; price: number }[];
  total: number;
}

const Dashboard: React.FC = () => {
  
  const [ categories, setCategories ] = useState<string[]>([]);
  const [ selectedCategory, setSelectedCategory ] = useState<string>('상의');
  const [ categorySummary, setCategorySummary ] = useState<CategorySummaryResponse | null>(null);
  const [ brandPurchase, setBrandPurchase ] = useState<LowestBrandPurchaseResponse | null>(null);
  const [ categoryRange, setCategoryRange ] = useState<CategoryPriceRangeResponse | null>(null);
  const [ error, setError ] = useState<string>('');

  // 초기 로드: 카테고리별 최저가격, 단일 브랜드 총액, 카테고리 목록
  useEffect(() => {
    getCategorySummary()
      .then((response) => setCategorySummary(response.data))
      .catch((err) => setError(err.message));

    getLowestBrandPurchase()
      .then((response) => setBrandPurchase(response.data))
      .catch((err) => setError(err.message));

    getCategories()
      .then((response) => setCategories(response.data))
      .catch((err) => setError(err.message));
  }, []);

  // 선택된 카테고리 변경 시: 최저/최고 가격 데이터 로드
  useEffect(() => {
    getCategoryPriceRange(selectedCategory)
      .then((response) => setCategoryRange(response.data))
      .catch((err) => setError(err.message));
  }, [selectedCategory]);

  return (
    <div className="max-w-6xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-6">조회 페이지</h1>
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}

      {/* Section 1: 카테고리별 최저가격 조회 */}
      <section className="mb-8">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">카테고리별 최저가격 조회</h2>
          {categorySummary ? (
            <Table className="w-full border border-gray-200 rounded">
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="px-4 py-2">카테고리</TableHead>
                  <TableHead className="px-4 py-2">브랜드</TableHead>
                  <TableHead className="px-4 py-2 text-right">가격</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-200">
                {categorySummary.items.map((item, index) => (
                  <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="px-4 py-2">{item.category}</TableCell>
                    <TableCell className="px-4 py-2">{item.brand}</TableCell>
                    <TableCell className="px-4 py-2 text-right">
                      {item.price.toLocaleString()}원
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-100">
                  <TableCell className="px-4 py-2 font-bold" colSpan={2}>
                    총액
                  </TableCell>
                  <TableCell className="px-4 py-2 text-right font-bold">
                    {categorySummary.total.toLocaleString()}원
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500">Loading...</p>
          )}
        </div>
      </section>

      {/* Section 2: 단일 브랜드 구매 최저 총액 */}
      <section className="mb-8">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">단일 브랜드 구매 최저 총액</h2>
          {brandPurchase ? (
            <div>
              <p className="mb-4">
                <span className="font-semibold">브랜드:</span> {brandPurchase.brand}
              </p>
              <Table className="w-full border border-gray-200 rounded">
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="px-4 py-2">카테고리</TableHead>
                    <TableHead className="px-4 py-2 text-right">가격</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-200">
                  {brandPurchase.category.map((item, index) => (
                    <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="px-4 py-2">{item.category}</TableCell>
                      <TableCell className="px-4 py-2 text-right">
                        {item.price.toLocaleString()}원
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-gray-100">
                    <TableCell className="px-4 py-2 font-bold">총액</TableCell>
                    <TableCell className="px-4 py-2 text-right font-bold">
                      {brandPurchase.total.toLocaleString()}원
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-gray-500">Loading...</p>
          )}
        </div>
      </section>

      {/* Section 3: 카테고리 최저/최고 가격 조회 */}
      <section>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">카테고리 최저/최고 가격 조회</h2>
          <div className="mb-4">
            <Select onValueChange={(value) => setSelectedCategory(value)} >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder={selectedCategory} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat, index) => (
                  <SelectItem key={index} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <h3 className="text-lg font-semibold mb-4">
            {selectedCategory} 카테고리 최저/최고 가격
          </h3>
          {categoryRange ? (
            <Table className="w-full border border-gray-200 rounded">
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="px-4 py-2">유형</TableHead>
                  <TableHead className="px-4 py-2">브랜드</TableHead>
                  <TableHead className="px-4 py-2 text-right">가격</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-200">
                <TableRow className="hover:bg-gray-50 transition-colors">
                  <TableCell className="px-4 py-2">최저가</TableCell>
                  <TableCell className="px-4 py-2">{categoryRange.lowestPrice[0].brand}</TableCell>
                  <TableCell className="px-4 py-2 text-right">
                    {categoryRange.lowestPrice[0].price.toLocaleString()}원
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-gray-50 transition-colors">
                  <TableCell className="px-4 py-2">최고가</TableCell>
                  <TableCell className="px-4 py-2">{categoryRange.highestPrice[0].brand}</TableCell>
                  <TableCell className="px-4 py-2 text-right">
                    {categoryRange.highestPrice[0].price.toLocaleString()}원
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500">Loading...</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;