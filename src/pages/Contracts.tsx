import React, { useState, useEffect } from 'react';
import { Search, Filter, FileText, DollarSign, Clock, CheckSquare, Pencil, Trash2, Plus, X, User, Tag, Calendar } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import type { Contract } from '../types';
import { OrderForm } from '../components/OrderForm';

// Mock data for demonstration
const mockContracts: Contract[] = [
  {
    id: '2025-1',
    year: 2025,
    type: 'PN',
    orderNumber: '2025-2',
    client: 'Persona Natural',
    product: 'sda',
    valueCUP: 200000,
    valueUSD: 340,
    startDate: '2025-02-27',
    endDate: '2025-02-27',
    status: 'pendiente de pago'
  }
];

const statusColors = {
  'entregado': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'producción': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'cancelado': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  'pendiente de pago': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
};

export function Contracts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [typeFilter, setTypeFilter] = useState('todos');
  const [yearFilter, setYearFilter] = useState('todos');
  const [isNewContractOpen, setIsNewContractOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [contracts, setContracts] = useState(mockContracts);
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

  const stats = {
    total: contracts.length,
    pending: contracts.filter(c => c.status === 'pendiente de pago').length,
    inProduction: contracts.filter(c => c.status === 'producción').length,
    completed: contracts.filter(c => c.status === 'entregado').length,
  };

  const handleDeleteContract = (id: string) => {
    setContracts(contracts.filter(contract => contract.id !== id));
  };

  const handleEditContract = (contract: Contract) => {
    setEditingContract(contract);
  };

  const handleSubmitContract = (contractData: Omit<Contract, 'id'>) => {
    if (editingContract) {
      setContracts(contracts.map(c => 
        c.id === editingContract.id 
          ? { ...contractData, id: editingContract.id }
          : c
      ));
      setEditingContract(null);
    } else {
      const newContract = {
        ...contractData,
        id: `${contractData.year}-${contracts.length + 1}`,
      };
      setContracts([...contracts, newContract]);
      setIsNewContractOpen(false);
    }
  };

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch = 
      contract.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.product.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' ? true : contract.status === statusFilter;
    const matchesType = typeFilter === 'todos' ? true : contract.type === typeFilter;
    const matchesYear = yearFilter === 'todos' ? true : contract.year.toString() === yearFilter;

    return matchesSearch && matchesStatus && matchesType && matchesYear;
  });

  const uniqueYears = Array.from(new Set(contracts.map(contract => contract.year))).sort((a, b) => b - a);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Lista de Contratos
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gestione y monitoree todos sus contratos
          </p>
        </div>
        <button 
          onClick={() => setIsNewContractOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium rounded-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo contrato
        </button>
      </div>

      <Dialog 
        open={isNewContractOpen || editingContract !== null} 
        onClose={() => {
          setIsNewContractOpen(false);
          setEditingContract(null);
        }}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full mx-4 p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingContract ? 'Editar Contrato' : 'Nuevo Contrato'}
                </Dialog.Title>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {editingContract ? 'Modifique los detalles del contrato' : 'Complete los detalles del nuevo contrato'}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsNewContractOpen(false);
                  setEditingContract(null);
                }}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <OrderForm
              contract={editingContract || undefined}
              onSubmit={handleSubmitContract}
              onCancel={() => {
                setIsNewContractOpen(false);
                setEditingContract(null);
              }}
            />
          </div>
        </div>
      </Dialog>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total de Contratos</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pendientes de Pago</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
              <DollarSign className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">En Producción</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.inProduction}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completados</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.completed}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <CheckSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filtros y Búsqueda
            </span>
          </div>
          
          <div className="flex-1 flex items-center space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Buscar Contrato..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="block w-48 pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="todos">Todos los estados</option>
              <option value="pendiente de pago">Pendiente de pago</option>
              <option value="producción">En producción</option>
              <option value="entregado">Completado</option>
              <option value="cancelado">Cancelado</option>
            </select>

            <select
              className="block w-48 pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="todos">Todos los tipos</option>
              <option value="PN">Persona Natural</option>
              <option value="Empresa">Empresa</option>
            </select>

            <select
              className="block w-48 pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            >
              <option value="todos">Todos los años</option>
              {uniqueYears.map(year => (
                <option key={year} value={year.toString()}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Información Básica
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Producto
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Valor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Fechas
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredContracts.map((contract) => (
              <tr key={contract.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {contract.orderNumber}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {contract.client}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {contract.type === 'PN' ? 'Persona Natural' : 'Empresa'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {contract.product}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white">
                    CUP: {formatCurrency(contract.valueCUP)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    USD: {formatCurrency(contract.valueUSD)}
                    {usdRate > 0 && (
                      <span className="ml-2 text-xs text-gray-400">
                        (Tasa: {formatCurrency(usdRate)})
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white">
                    Inicio: {new Date(contract.startDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Fin: {new Date(contract.endDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[contract.status]}`}>
                    {contract.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-3">
                    <button
                      onClick={() => handleEditContract(contract)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteContract(contract.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}