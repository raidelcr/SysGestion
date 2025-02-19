import React, { useState, useEffect } from 'react';
import { Contract } from '../types';
import { FileText, User, Tag, Calendar, DollarSign } from 'lucide-react';

interface OrderFormProps {
  contract?: Contract;
  onSubmit: (contract: Omit<Contract, 'id'>) => void;
  onCancel?: () => void;
}

export function OrderForm({ contract, onSubmit, onCancel }: OrderFormProps) {
  const [formData, setFormData] = useState<Omit<Contract, 'id'>>({
    year: new Date().getFullYear(),
    type: 'PN',
    orderNumber: '',
    client: '',
    product: '',
    valueCUP: 0,
    valueUSD: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    status: 'pendiente de pago'
  });
  const [usdRate, setUsdRate] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsdRate = async () => {
      try {
        const response = await fetch('https://eltoque.com');
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const usdRow = doc.querySelector('tr:has(span.currency#cell-title1)');
        if (usdRow) {
          const salePriceElement = usdRow.querySelector('.price-text');
          if (salePriceElement) {
            const rate = parseFloat(salePriceElement.textContent?.trim() || '0');
            setUsdRate(rate);
          }
        }
      } catch (error) {
        console.error('Error al obtener el tipo de cambio en USD:', error);
        setError('Error al obtener la tasa de cambio');
      }
    };

    fetchUsdRate();
  }, []);

  useEffect(() => {
    if (contract) {
      setFormData({
        year: contract.year,
        type: contract.type,
        orderNumber: contract.orderNumber,
        client: contract.client,
        product: contract.product,
        valueCUP: contract.valueCUP,
        valueUSD: contract.valueUSD,
        startDate: contract.startDate,
        endDate: contract.endDate,
        status: contract.status
      });
    }
  }, [contract]);

  useEffect(() => {
    // Calculate USD value based on CUP and rate
    if (usdRate > 0) {
      const usdValue = formData.valueCUP / usdRate;
      setFormData(prev => ({ ...prev, valueUSD: usdValue }));
    }
  }, [formData.valueCUP, usdRate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'year' | 'valueCUP' | 'valueUSD') => {
    const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
          <FileText className="w-5 h-5" />
          <h3 className="font-medium">Información Básica</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Año
            </label>
            <input
              type="number"
              value={formData.year || ''}
              onChange={(e) => handleNumberChange(e, 'year')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tipo
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value as 'PN' | 'Empresa'})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="PN">Persona Natural</option>
              <option value="Empresa">Empresa</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              No. Orden
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-gray-400">
                {formData.year}-
              </span>
              <input
                type="text"
                value={formData.orderNumber}
                onChange={(e) => setFormData({...formData, orderNumber: e.target.value})}
                className="w-full pl-16 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Número"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cliente
            </label>
            <input
              type="text"
              value={formData.client}
              onChange={(e) => setFormData({...formData, client: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
          <Tag className="w-5 h-5" />
          <h3 className="font-medium">Detalles del Producto</h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Producto Contratado
          </label>
          <textarea
            value={formData.product}
            onChange={(e) => setFormData({...formData, product: e.target.value})}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Valor (CUP)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                $
              </span>
              <input
                type="number"
                value={formData.valueCUP || ''}
                onChange={(e) => handleNumberChange(e, 'valueCUP')}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Valor (USD)
              {usdRate > 0 && (
                <span className="ml-2 text-xs text-gray-500">
                  (Tasa: {formatCurrency(usdRate)})
                </span>
              )}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                $
              </span>
              <input
                type="number"
                value={formatCurrency(usdRate)}
                disabled
                className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dates and Status */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
          <Calendar className="w-5 h-5" />
          <h3 className="font-medium">Fechas y Estado</h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fecha de Inicio
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fecha de Término
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Estado
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value as Contract['status']})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="pendiente de pago">Pendiente de Pago</option>
              <option value="producción">En Producción</option>
              <option value="entregado">Completado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 rounded-lg"
        >
          {contract ? 'Actualizar Pedido' : 'Crear Pedido'}
        </button>
      </div>
    </form>
  );
}