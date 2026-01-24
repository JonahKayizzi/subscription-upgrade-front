import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FaMap, FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaSearch 
} from 'react-icons/fa';
import { 
  useGetChartsQuery, 
  useCreateChartMutation, 
  useUpdateChartMutation, 
  useDeleteChartMutation 
} from '../api/apiSlice';
import Modal from './ui/Modal';

const Container = styled.div`
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  color: var(--color-text);
  font-size: 1.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Button = styled.button`
  padding: 12px 24px;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent2) 100%);
  color: var(--color-text);
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(247, 184, 1, 0.3);
  }
  
  &.danger {
    background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
  }
  
  &.secondary {
    background: var(--color-bg);
    border: 1px solid var(--color-border);
  }
`;

const SearchBar = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 0.9rem;
  margin-bottom: 24px;
  
  &:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 2px rgba(247, 184, 1, 0.1);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: var(--color-bg-card);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.thead`
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent2) 100%);
`;

const TableHeaderCell = styled.th`
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: var(--color-text);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid var(--color-border);
  
  &:hover {
    background: var(--color-bg);
  }
`;

const TableCell = styled.td`
  padding: 16px;
  color: var(--color-text);
  font-size: 0.9rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  padding: 8px;
  background: ${props => props.danger ? 'rgba(220, 38, 38, 0.1)' : 'var(--color-bg)'};
  color: ${props => props.danger ? '#dc2626' : 'var(--color-text)'};
  border: 1px solid var(--color-border);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.danger ? 'rgba(220, 38, 38, 0.2)' : 'var(--color-accent)'};
    color: var(--color-text);
  }
`;

const ModalContent = styled.div`
  background: var(--color-bg-card);
  border-radius: 16px;
  padding: 32px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h2`
  color: var(--color-text);
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    margin-bottom: 8px;
    color: var(--color-text);
    font-weight: 500;
    font-size: 0.9rem;
  }
  
  input, select, textarea {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-bg);
    color: var(--color-text);
    font-size: 0.9rem;
    
    &:focus {
      outline: none;
      border-color: var(--color-accent);
      box-shadow: 0 0 0 2px rgba(247, 184, 1, 0.1);
    }
  }
  
  textarea {
    resize: vertical;
    min-height: 80px;
  }
  
  small {
    display: block;
    margin-top: 4px;
    color: var(--color-text-muted);
    font-size: 0.8rem;
  }
`;

const PriceRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 12px;
  align-items: end;
  margin-bottom: 12px;
`;

const PriceInput = styled.input`
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 2px rgba(247, 184, 1, 0.1);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--color-accent);
    cursor: pointer;
  }
  
  label {
    margin: 0;
    cursor: pointer;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const LoadingText = styled.div`
  text-align: center;
  color: var(--color-text-muted);
  padding: 48px;
  font-size: 1rem;
`;

const ErrorText = styled.div`
  color: var(--color-error);
  background: rgba(255, 77, 79, 0.1);
  border: 1px solid var(--color-error);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  text-align: center;
`;

const CHART_TYPES = [
  { value: 'WAC', label: 'World Aeronautical Charts' },
  { value: 'ANC', label: 'Aeronautical Charts' },
  { value: 'AC', label: 'Aerodrome Charts' },
  { value: 'AOC', label: 'Aerodrome Obstacle Charts' },
  { value: 'PARKING', label: 'Parking/Docking Charts' },
  { value: 'ENROUTE', label: 'Enroute Charts' },
  { value: 'INDEX', label: 'Index Charts' },
  { value: 'IAC', label: 'Instrument Approach Charts' },
  { value: 'SID', label: 'Standard Departure Charts' },
  { value: 'STAR', label: 'Standard Arrival Charts' },
  { value: 'VAC', label: 'Visual Approach Charts' }
];

const CHART_SIZES = [
  { value: 'a4', label: 'A4' },
  { value: 'a3', label: 'A3' },
  { value: 'a0', label: 'A0' }
];

export default function ChartsManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingChart, setEditingChart] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    scale: '',
    name: '',
    chart_type: '',
    update_date: '',
    is_active: true,
    sort_order: 0,
    prices: []
  });
  
  const { data: chartsData, isLoading, error, refetch } = useGetChartsQuery({
    search: searchQuery || undefined,
    limit: 1000,
    active_only: false
  });
  
  const [createChart] = useCreateChartMutation();
  const [updateChart] = useUpdateChartMutation();
  const [deleteChart] = useDeleteChartMutation();
  
  const charts = chartsData?.charts || [];
  
  const filteredCharts = charts.filter(chart => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      chart.title?.toLowerCase().includes(query) ||
      (Array.isArray(chart.name) ? chart.name.join(' ') : chart.name)?.toLowerCase().includes(query) ||
      chart.chart_type?.toLowerCase().includes(query)
    );
  });
  
  const handleOpenModal = (chart = null) => {
    if (chart) {
      setEditingChart(chart);
      setFormData({
        title: chart.title || '',
        scale: chart.scale || '',
        name: Array.isArray(chart.name) ? chart.name.join(', ') : chart.name || '',
        chart_type: chart.chart_type || '',
        update_date: chart.update_date || '',
        is_active: chart.is_active !== undefined ? chart.is_active : true,
        sort_order: chart.sort_order || 0,
        prices: chart.prices || []
      });
    } else {
      setEditingChart(null);
      setFormData({
        title: '',
        scale: '',
        name: '',
        chart_type: '',
        update_date: '',
        is_active: true,
        sort_order: 0,
        prices: []
      });
    }
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingChart(null);
  };
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleAddPrice = () => {
    setFormData(prev => ({
      ...prev,
      prices: [...prev.prices, { size: 'a4', price_usd: '' }]
    }));
  };
  
  const handlePriceChange = (index, field, value) => {
    setFormData(prev => {
      const newPrices = [...prev.prices];
      newPrices[index] = { ...newPrices[index], [field]: value };
      return { ...prev, prices: newPrices };
    });
  };
  
  const handleRemovePrice = (index) => {
    setFormData(prev => ({
      ...prev,
      prices: prev.prices.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const submitData = {
        ...formData,
        name: formData.name.split(',').map(n => n.trim()).filter(n => n),
        prices: formData.prices.filter(p => p.size && p.price_usd).map(p => ({
          size: p.size,
          price_usd: parseFloat(p.price_usd)
        }))
      };
      
      if (editingChart) {
        await updateChart({ id: editingChart.id, ...submitData }).unwrap();
      } else {
        await createChart(submitData).unwrap();
      }
      
      refetch();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving chart:', err);
      alert(err.data?.error || 'Failed to save chart');
    }
  };
  
  const handleDelete = async (chartId) => {
    if (!window.confirm('Are you sure you want to delete this chart?')) {
      return;
    }
    
    try {
      await deleteChart(chartId).unwrap();
      refetch();
    } catch (err) {
      console.error('Error deleting chart:', err);
      alert(err.data?.error || 'Failed to delete chart');
    }
  };
  
  if (isLoading) {
    return (
      <Container>
        <LoadingText>Loading charts...</LoadingText>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container>
        <ErrorText>Error loading charts: {error.message || 'Unknown error'}</ErrorText>
      </Container>
    );
  }
  
  return (
    <Container>
      <Header>
        <Title>
          <FaMap /> Charts Management
        </Title>
        <Button onClick={() => handleOpenModal()}>
          <FaPlus /> Add New Chart
        </Button>
      </Header>
      
      <SearchBar
        type="text"
        placeholder="Search charts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      
      <Table>
        <TableHeader>
          <tr>
            <TableHeaderCell>Title</TableHeaderCell>
            <TableHeaderCell>Type</TableHeaderCell>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Scale</TableHeaderCell>
            <TableHeaderCell>Update Date</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </tr>
        </TableHeader>
        <tbody>
          {filteredCharts.map(chart => (
            <TableRow key={chart.id}>
              <TableCell>{chart.title || '-'}</TableCell>
              <TableCell>{chart.chart_type}</TableCell>
              <TableCell>
                {Array.isArray(chart.name) ? chart.name.join(', ') : chart.name}
              </TableCell>
              <TableCell>{chart.scale || '-'}</TableCell>
              <TableCell>{chart.update_date || '-'}</TableCell>
              <TableCell>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  background: chart.is_active ? 'rgba(16, 185, 129, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                  color: chart.is_active ? '#10b981' : '#6b7280'
                }}>
                  {chart.is_active ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
              <TableCell>
                <ActionButtons>
                  <IconButton onClick={() => handleOpenModal(chart)} title="Edit">
                    <FaEdit />
                  </IconButton>
                  <IconButton 
                    danger 
                    onClick={() => handleDelete(chart.id)} 
                    title="Delete"
                  >
                    <FaTrash />
                  </IconButton>
                </ActionButtons>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
      
      {showModal && (
        <Modal isOpen={showModal} onClose={handleCloseModal}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                {editingChart ? 'Edit Chart' : 'Add New Chart'}
              </ModalTitle>
              <IconButton onClick={handleCloseModal}>
                <FaTimes />
              </IconButton>
            </ModalHeader>
            
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <label>Chart Type *</label>
                <select
                  name="chart_type"
                  value={formData.chart_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select type</option>
                  {CHART_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </FormGroup>
              
              <FormGroup>
                <label>Name(s) *</label>
                <textarea
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter chart name(s), separated by commas"
                  required
                />
                <small>Separate multiple names with commas</small>
              </FormGroup>
              
              <FormGroup>
                <label>Scale</label>
                <input
                  type="text"
                  name="scale"
                  value={formData.scale}
                  onChange={handleInputChange}
                  placeholder="e.g., 1:1 000 000"
                />
              </FormGroup>
              
              <FormGroup>
                <label>Update Date</label>
                <input
                  type="text"
                  name="update_date"
                  value={formData.update_date}
                  onChange={handleInputChange}
                  placeholder="e.g., JAN 23"
                />
              </FormGroup>
              
              <FormGroup>
                <label>Sort Order</label>
                <input
                  type="number"
                  name="sort_order"
                  value={formData.sort_order}
                  onChange={handleInputChange}
                  min="0"
                />
              </FormGroup>
              
              <FormGroup>
                <label>Prices</label>
                {formData.prices.map((price, index) => (
                  <PriceRow key={index}>
                    <select
                      value={price.size}
                      onChange={(e) => handlePriceChange(index, 'size', e.target.value)}
                    >
                      {CHART_SIZES.map(size => (
                        <option key={size.value} value={size.value}>
                          {size.label}
                        </option>
                      ))}
                    </select>
                    <PriceInput
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Price in USD"
                      value={price.price_usd}
                      onChange={(e) => handlePriceChange(index, 'price_usd', e.target.value)}
                    />
                    <IconButton 
                      type="button"
                      danger 
                      onClick={() => handleRemovePrice(index)}
                    >
                      <FaTimes />
                    </IconButton>
                  </PriceRow>
                ))}
                <Button 
                  type="button" 
                  className="secondary" 
                  onClick={handleAddPrice}
                >
                  <FaPlus /> Add Price
                </Button>
              </FormGroup>
              
              <CheckboxGroup>
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                />
                <label htmlFor="is_active">Active (available for ordering)</label>
              </CheckboxGroup>
              
              <ButtonRow>
                <Button type="button" className="secondary" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button type="submit">
                  <FaSave /> {editingChart ? 'Update' : 'Create'} Chart
                </Button>
              </ButtonRow>
            </form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}
