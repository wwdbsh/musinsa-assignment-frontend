import React, { useState } from 'react';
import { createBrand, updateBrand, deleteBrand, getBrandIdByName } from '../services/api';

interface ProductInput {
  category: string;
  price: number;
}

const AdminPanel: React.FC = () => {
  // Create Brand 상태
  const [ createBrandName, setCreateBrandName ] = useState<string>('');
  const [ createProducts, setCreateProducts ] = useState<ProductInput[]>([{ category: '', price: 0 }]);
  const [ createMessage, setCreateMessage ] = useState<string>('');

  // Update Brand 상태
  const [ updateSearchBrandName, setUpdateSearchBrandName ] = useState<string>(''); // 검색할 브랜드 이름
  const [ updateNewBrandName, setUpdateNewBrandName ] = useState<string>(''); // 업데이트할 새로운 브랜드 이름
  const [ updateProducts, setUpdateProducts ] = useState<ProductInput[]>([{ category: '', price: 0 }]);
  const [ updateMessage, setUpdateMessage ] = useState<string>('');

  // Delete Brand 상태
  const [ deleteSearchBrandName, setDeleteSearchBrandName ] = useState<string>(''); // 삭제할 브랜드 이름
  const [ deleteMessage, setDeleteMessage ] = useState<string>('');

  // Create Brand - 제품 입력 변경 핸들러
  const handleCreateProductChange = (index: number, field: keyof ProductInput, value: string) => {
    const newProducts = [...createProducts];
    newProducts[index] = {
      ...newProducts[index],
      [field]: field === 'price' ? Number(value) : value,
    };
    setCreateProducts(newProducts);
  };

  // Create Brand - 새로운 제품 입력 행 추가
  const addCreateProductRow = () => {
    setCreateProducts([...createProducts, { category: '', price: 0 }]);
  };

  // Create Brand 폼 제출 핸들러
  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: createBrandName,
        products: createProducts,
      };
      const response = await createBrand(payload);
      if (response.data.status === 'SUCCESS') {
        setCreateMessage('브랜드 생성 성공!');
      } else {
        setCreateMessage('브랜드 생성 실패!');
      }
    } catch (error: any) {
      setCreateMessage(`Error: ${error.message}`);
    }
  };

  // Update Brand 폼 제출 핸들러
  const handleUpdateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateSearchBrandName) {
      setUpdateMessage('브랜드 이름을 입력해 주세요.');
      return;
    }
    try {
      // 브랜드 이름으로 ID 조회
      const idResponse = await getBrandIdByName(updateSearchBrandName);
      const brandId = idResponse.data.id;
      if (!brandId) {
        setUpdateMessage('해당 브랜드를 찾을 수 없습니다.');
        return;
      }
      const payload = {
        name: updateNewBrandName,
        products: updateProducts,
      };
      const response = await updateBrand(brandId, payload);
      if (response.data.status === 'SUCCESS') {
        setUpdateMessage('브랜드 수정 성공!');
      } else {
        setUpdateMessage('브랜드 수정 실패!');
      }
    } catch (error: any) {
      setUpdateMessage(`해당 브랜드를 찾을 수 없습니다.`);
    }
  };

  // Delete Brand 폼 제출 핸들러
  const handleDeleteBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteSearchBrandName) {
      setDeleteMessage('브랜드 이름을 입력해 주세요.');
      return;
    }
    try {
      // 브랜드 이름으로 ID 조회
      const idResponse = await getBrandIdByName(deleteSearchBrandName);
      const brandId = idResponse.data.id;
      if (!brandId) {
        setDeleteMessage('해당 브랜드를 찾을 수 없습니다.');
        return;
      }
      const response = await deleteBrand(brandId);
      if (response.data.status === 'SUCCESS') {
        setDeleteMessage('브랜드 삭제 성공!');
      } else {
        setDeleteMessage('브랜드 삭제 실패!');
      }
    } catch (error: any) {
      setDeleteMessage(`해당 브랜드를 찾을 수 없습니다.`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">관리자 페이지</h1>

      {/* Create Brand Section */}
      <section className="bg-white shadow rounded-lg p-5 mb-8">
        <h2 className="text-xl font-semibold mb-4">브랜드 생성</h2>
        <form onSubmit={handleCreateBrand} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">브랜드 이름</label>
            <input
              type="text"
              value={createBrandName}
              onChange={(e) => setCreateBrandName(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              placeholder="예) A"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">제품</h3>
            {createProducts.map((product, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="카테고리"
                  value={product.category}
                  onChange={(e) => handleCreateProductChange(index, 'category', e.target.value)}
                  className="border border-gray-300 rounded p-2 w-1/2"
                />
                <input
                  type="number"
                  placeholder="가격"
                  value={product.price}
                  onChange={(e) => handleCreateProductChange(index, 'price', e.target.value)}
                  className="border border-gray-300 rounded p-2 w-1/2"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addCreateProductRow}
              className="bg-gray-100 text-gray-700 border border-gray-300 rounded px-3 py-2 hover:bg-gray-200 transition-colors"
            >
              제품 추가
            </button>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            브랜드 생성
          </button>
        </form>
        {createMessage && (
          <p className="mt-3 text-sm text-blue-600">
            {createMessage}
          </p>
        )}
      </section>

      {/* Update Brand Section */}
      <section className="bg-white shadow rounded-lg p-5 mb-8">
        <h2 className="text-xl font-semibold mb-4">브랜드 수정</h2>
        <form onSubmit={handleUpdateBrand} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">브랜드 이름</label>
            <input
              type="text"
              value={updateSearchBrandName}
              onChange={(e) => setUpdateSearchBrandName(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              placeholder="예) A"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">새로운 브랜드 이름</label>
            <input
              type="text"
              value={updateNewBrandName}
              onChange={(e) => setUpdateNewBrandName(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              placeholder="예) J"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">제품</h3>
            {updateProducts.map((product, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="카테고리"
                  value={product.category}
                  onChange={(e) => {
                    setUpdateProducts((prev) => {
                      const newProducts = [...prev];
                      newProducts[index].category = e.target.value;
                      return newProducts;
                    });
                  }}
                  className="border border-gray-300 rounded p-2 w-1/2"
                />
                <input
                  type="number"
                  placeholder="가격"
                  value={product.price}
                  onChange={(e) => {
                    setUpdateProducts((prev) => {
                      const newProducts = [...prev];
                      newProducts[index].price = Number(e.target.value);
                      return newProducts;
                    });
                  }}
                  className="border border-gray-300 rounded p-2 w-1/2"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => setUpdateProducts([...updateProducts, { category: '', price: 0 }])}
              className="bg-gray-100 text-gray-700 border border-gray-300 rounded px-3 py-2 hover:bg-gray-200 transition-colors"
            >
              제품 추가
            </button>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            브랜드 수정
          </button>
        </form>
        {updateMessage && (
          <p className="mt-3 text-sm text-blue-600">
            {updateMessage}
          </p>
        )}
      </section>

      {/* Delete Brand Section */}
      <section className="bg-white shadow rounded-lg p-5">
        <h2 className="text-xl font-semibold mb-4">브랜드 삭제</h2>
        <form onSubmit={handleDeleteBrand} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">브랜드 이름</label>
            <input
              type="text"
              value={deleteSearchBrandName}
              onChange={(e) => setDeleteSearchBrandName(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              placeholder="예) A"
            />
          </div>
          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            브랜드 삭제
          </button>
        </form>
        {deleteMessage && (
          <p className="mt-3 text-sm text-blue-600">
            {deleteMessage}
          </p>
        )}
      </section>
    </div>
  );
};

export default AdminPanel;