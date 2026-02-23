import React, { useState, useMemo } from "react";
import styled from "styled-components";
import {
  FaMap,
  FaCheckCircle,
  FaSearch,
  FaFilter,
  FaTh,
  FaList,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { useGetChartsQuery, useGetChartTypesQuery } from "../api/apiSlice";
import ChartOrderForm from "./ChartOrderForm";
import Modal from "./ui/Modal";
import Login from "./Login";
import Register from "./Register";

// Styled Components
const ChartsSection = styled.div`
  background: #1e1b3a;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  padding: 28px 32px 32px;
  margin-bottom: 24px;
  color: #ffffff;
  width: 100%;
  max-width: none;
  min-width: 0;
  box-sizing: border-box;
`;

const ChartsSectionTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-accent);
  margin: 0 0 20px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ControlsBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
  margin-bottom: 20px;
  align-items: center;
  width: 100%;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
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

  &::placeholder {
    color: var(--color-text-muted);
  }
`;

const FilterSelect = styled.select`
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 0.9rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 2px rgba(247, 184, 1, 0.1);
  }
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 4px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
`;

const ViewButton = styled.button`
  padding: 12px 16px;
  background: ${(props) =>
    props.active ? "var(--color-accent)" : "var(--color-bg)"};
  color: ${(props) =>
    props.active ? "var(--color-text)" : "var(--color-text-muted)"};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) =>
      props.active ? "var(--color-accent)" : "var(--color-bg)"};
    opacity: 0.9;
  }
`;

const ChartsTableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  margin-bottom: 24px;
  min-width: 0;
  background: #1a1333;
`;

const ChartsTable = styled.div`
  min-width: 640px;
`;

const ChartsTableHeader = styled.div`
  background: linear-gradient(
    135deg,
    var(--color-accent) 0%,
    #e5a502 50%,
    var(--color-accent2) 100%
  );
  color: var(--color-text);
  padding: 14px 20px;
  display: grid;
  grid-template-columns: 2fr 1fr 2fr 1.5fr 1fr 0.9fr;
  gap: 16px;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  align-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 8px;
    text-align: center;
    padding: 12px 16px;
  }
`;

const ChartsTableRow = styled.div`
  padding: 14px 20px;
  display: grid;
  grid-template-columns: 2fr 1fr 2fr 1.5fr 1fr 0.9fr;
  gap: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  align-items: center;
  background: #1a1333;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: #231942;
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 8px;
    text-align: center;
    padding: 16px;
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const ChartCardTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 12px 0;
  line-height: 1.4;
`;

const ChartCardInfo = styled.div`
  font-size: 0.9rem;
  color: #e2e8f0;
  margin-bottom: 8px;
  line-height: 1.4;
`;

const ChartCardPrices = styled.div`
  margin: 12px 0;
  padding: 12px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 6px;
`;

const ChartCardPrice = styled.div`
  font-size: 0.85rem;
  color: #10b981;
  font-weight: 600;
  margin: 4px 0;
`;

const ChartTitle = styled.div`
  font-weight: 600;
  color: #ffffff;
  font-size: 0.95rem;
  line-height: 1.4;
  letter-spacing: 0.02em;
`;

const ChartScale = styled.div`
  font-size: 0.9rem;
  color: #ffffff;
  font-weight: 500;
  line-height: 1.4;
`;

const ChartName = styled.div`
  font-size: 0.9rem;
  color: #ffffff;
  line-height: 1.4;
  font-weight: 500;
`;

const ChartPrices = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.8rem;
  color: #10b981;
  font-weight: 600;
`;

const ChartDate = styled.div`
  font-size: 0.8rem;
  color: var(--color-accent2);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const OrderButton = styled.button`
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  justify-content: center;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin: 24px 0;
`;

const PaginationButton = styled.button`
  padding: 8px 16px;
  background: ${(props) =>
    props.active ? "var(--color-accent)" : "var(--color-bg)"};
  color: ${(props) =>
    props.active ? "var(--color-text)" : "var(--color-text-muted)"};
  border: 1px solid var(--color-border);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: var(--color-accent);
    color: var(--color-text);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ChartCounter = styled.div`
  text-align: left;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  margin-bottom: 16px;
  font-weight: 500;
`;

const ChartsNote = styled.div`
  background: rgba(247, 184, 1, 0.1);
  border: 1px solid var(--color-accent);
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
  color: var(--color-accent);
  font-size: 0.9rem;
  line-height: 1.4;
`;

const CategorySection = styled.div`
  margin-bottom: 32px;
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-bg-card);
  }
`;

const CategoryTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-accent);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CategoryCount = styled.span`
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-left: 12px;
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

const EmptyState = styled.div`
  text-align: center;
  color: var(--color-text-muted);
  padding: 48px;
  font-size: 1rem;
`;

// Chart type labels
const CHART_TYPE_LABELS = {
  WAC: "World Aeronautical Charts",
  ANC: "Aeronautical Charts",
  AC: "Aerodrome Charts",
  AOC: "Aerodrome Obstacle Charts",
  PARKING: "Parking/Docking Charts",
  ENROUTE: "Enroute Charts",
  INDEX: "Index Charts",
  IAC: "Instrument Approach Charts",
  SID: "Standard Departure Charts",
  STAR: "Standard Arrival Charts",
  VAC: "Visual Approach Charts",
};

// Main Component
const AeronauticalCharts = () => {
  const isAuthenticated = useSelector((state) => !!state.auth.token);
  const [selectedChart, setSelectedChart] = useState(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  // UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'
  const [collapsedCategories, setCollapsedCategories] = useState(new Set());
  const [groupByCategory, setGroupByCategory] = useState(false);

  const pageSize = 20;

  // Fetch charts
  const {
    data: chartsData,
    isLoading,
    error,
    refetch,
  } = useGetChartsQuery({
    type: selectedType || undefined,
    search: searchQuery || undefined,
    page: currentPage,
    limit: groupByCategory ? 1000 : pageSize, // Get all for grouping
    active_only: true,
  });

  // Fetch chart types for filter
  const { data: chartTypes } = useGetChartTypesQuery();

  // Group charts by category
  const groupedCharts = useMemo(() => {
    if (!chartsData?.charts) return {};

    const grouped = {};
    chartsData.charts.forEach((chart) => {
      const type = chart.chart_type;
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(chart);
    });

    return grouped;
  }, [chartsData]);

  // Get displayed charts (either grouped or paginated)
  const displayedCharts = useMemo(() => {
    if (!chartsData?.charts) return [];

    if (groupByCategory) {
      // Return all charts for grouping
      return chartsData.charts;
    } else {
      // Return paginated charts
      return chartsData.charts;
    }
  }, [chartsData, groupByCategory]);

  const handleOrderClick = (chart) => {
    setSelectedChart(chart);

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setShowOrderForm(true);
  };

  const handleCloseOrderForm = () => {
    setShowOrderForm(false);
    setSelectedChart(null);
  };

  const toggleCategory = (category) => {
    setCollapsedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setCurrentPage(1); // Reset to first page on filter
  };

  const formatPrice = (prices) => {
    if (!prices || prices.length === 0) return "N/A";
    return prices
      .map((p) => `${p.size.toUpperCase()}: $${p.price_usd} USD`)
      .join(", ");
  };

  const formatPriceArray = (prices) => {
    if (!prices || prices.length === 0) return [];
    return prices.map(
      (p) => `${p.size.toUpperCase()} size: ${p.price_usd} USD`,
    );
  };

  // Render chart row (for table view)
  const renderChartRow = (chart) => (
    <ChartsTableRow key={chart.id}>
      <ChartTitle>{chart.title || "-"}</ChartTitle>
      <ChartScale>{chart.scale || "-"}</ChartScale>
      <ChartName>
        {Array.isArray(chart.name)
          ? chart.name.map((nameItem, i) => <div key={i}>{nameItem}</div>)
          : chart.name}
      </ChartName>
      <ChartPrices>
        {chart.prices && chart.prices.length > 0 ? (
          chart.prices.map((price, i) => (
            <div key={i}>
              {price.size.toUpperCase()}: ${price.price_usd} USD
            </div>
          ))
        ) : (
          <div>N/A</div>
        )}
      </ChartPrices>
      <ChartDate>{chart.update_date || "-"}</ChartDate>
      <OrderButton onClick={() => handleOrderClick(chart)}>
        <FaCheckCircle /> Order
      </OrderButton>
    </ChartsTableRow>
  );

  // Render chart card (for grid view)
  const renderChartCard = (chart) => (
    <ChartCard key={chart.id}>
      <ChartCardTitle>{chart.title || "Chart"}</ChartCardTitle>
      <ChartCardInfo>
        <strong>Name:</strong>{" "}
        {Array.isArray(chart.name) ? chart.name.join(", ") : chart.name}
      </ChartCardInfo>
      {chart.scale && (
        <ChartCardInfo>
          <strong>Scale:</strong> {chart.scale}
        </ChartCardInfo>
      )}
      {chart.update_date && (
        <ChartCardInfo>
          <strong>Update Date:</strong> {chart.update_date}
        </ChartCardInfo>
      )}
      {chart.prices && chart.prices.length > 0 && (
        <ChartCardPrices>
          {chart.prices.map((price, i) => (
            <ChartCardPrice key={i}>
              {price.size.toUpperCase()}: ${price.price_usd} USD
            </ChartCardPrice>
          ))}
        </ChartCardPrices>
      )}
      <OrderButton onClick={() => handleOrderClick(chart)}>
        <FaCheckCircle /> Order
      </OrderButton>
    </ChartCard>
  );

  if (isLoading) {
    return (
      <ChartsSection>
        <LoadingText>Loading charts...</LoadingText>
      </ChartsSection>
    );
  }

  if (error) {
    return (
      <ChartsSection>
        <ErrorText>
          Error loading charts: {error.message || "Unknown error"}
        </ErrorText>
      </ChartsSection>
    );
  }

  const charts = chartsData?.charts || [];
  const pagination = chartsData?.pagination || {};

  return (
    <ChartsSection>
      <ChartsSectionTitle>
        <FaMap /> Aeronautical Charts - Complete Catalog & Orders
      </ChartsSectionTitle>

      <ControlsBar>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <FaSearch
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--color-text-muted)",
            }}
          />
          <SearchInput
            type="text"
            placeholder="Search charts..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ paddingLeft: "40px" }}
          />
        </div>
        <FilterSelect value={selectedType} onChange={handleTypeChange}>
          <option value="">All Types</option>
          {chartTypes?.map((type) => (
            <option key={type.chart_type} value={type.chart_type}>
              {CHART_TYPE_LABELS[type.chart_type] || type.chart_type} (
              {type.count})
            </option>
          ))}
        </FilterSelect>
        <ViewToggle>
          <ViewButton
            active={viewMode === "table"}
            onClick={() => setViewMode("table")}
            title="Table View"
          >
            <FaList />
          </ViewButton>
          <ViewButton
            active={viewMode === "grid"}
            onClick={() => setViewMode("grid")}
            title="Grid View"
          >
            <FaTh />
          </ViewButton>
        </ViewToggle>
        <ViewButton
          active={groupByCategory}
          onClick={() => {
            setGroupByCategory(!groupByCategory);
            setCurrentPage(1);
          }}
        >
          <FaFilter /> {groupByCategory ? "Ungroup" : "Group by Type"}
        </ViewButton>
      </ControlsBar>

      <ChartCounter>
        Showing {charts.length} of {pagination.total || 0} available charts
        {selectedType &&
          ` (filtered by ${CHART_TYPE_LABELS[selectedType] || selectedType})`}
      </ChartCounter>

      {charts.length === 0 ? (
        <EmptyState>
          <h3>No charts found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </EmptyState>
      ) : groupByCategory ? (
        // Grouped view
        Object.entries(groupedCharts).map(([type, typeCharts]) => {
          const isCollapsed = collapsedCategories.has(type);
          return (
            <CategorySection key={type}>
              <CategoryHeader onClick={() => toggleCategory(type)}>
                <div>
                  <CategoryTitle>
                    {CHART_TYPE_LABELS[type] || type}
                    <CategoryCount>({typeCharts.length})</CategoryCount>
                  </CategoryTitle>
                </div>
                {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
              </CategoryHeader>
              {!isCollapsed &&
                (viewMode === "table" ? (
                  <ChartsTableWrapper>
                    <ChartsTable>
                      <ChartsTableHeader>
                        <div>Title of Series</div>
                        <div>Scale</div>
                        <div>Name and/or Number</div>
                        <div>Price ($)</div>
                        <div>Update Date</div>
                        <div>Order</div>
                      </ChartsTableHeader>
                      {typeCharts.map(renderChartRow)}
                    </ChartsTable>
                  </ChartsTableWrapper>
                ) : (
                  <ChartsGrid>{typeCharts.map(renderChartCard)}</ChartsGrid>
                ))}
            </CategorySection>
          );
        })
      ) : // Regular view
      viewMode === "table" ? (
        <ChartsTableWrapper>
          <ChartsTable>
            <ChartsTableHeader>
              <div>Title of Series</div>
              <div>Scale</div>
              <div>Name and/or Number</div>
              <div>Price ($)</div>
              <div>Update Date</div>
              <div>Order</div>
            </ChartsTableHeader>
            {displayedCharts.map(renderChartRow)}
          </ChartsTable>
        </ChartsTableWrapper>
      ) : (
        <ChartsGrid>{displayedCharts.map(renderChartCard)}</ChartsGrid>
      )}

      {/* Pagination */}
      {!groupByCategory && pagination.totalPages > 1 && (
        <Pagination>
          <PaginationButton
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <FaChevronLeft /> Previous
          </PaginationButton>

          {Array.from(
            { length: Math.min(5, pagination.totalPages) },
            (_, i) => {
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <PaginationButton
                  key={pageNum}
                  active={currentPage === pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </PaginationButton>
              );
            },
          )}

          <PaginationButton
            onClick={() =>
              setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))
            }
            disabled={currentPage === pagination.totalPages}
          >
            Next <FaChevronRight />
          </PaginationButton>
        </Pagination>
      )}

      <ChartsNote>
        <strong>Note:</strong> Charts can be bought in the local currency at the
        prevailing UCAA monthly exchange rate.
      </ChartsNote>

      {/* Chart Order Form Modal */}
      <ChartOrderForm
        chart={
          selectedChart
            ? {
                ...selectedChart,
                prices: formatPriceArray(selectedChart.prices),
              }
            : null
        }
        isOpen={showOrderForm}
        onClose={handleCloseOrderForm}
      />

      {/* Authentication Modal */}
      <Modal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)}>
        {authMode === "login" ? (
          <Login
            onSuccess={() => {
              setShowAuthModal(false);
              if (selectedChart) {
                setShowOrderForm(true);
              }
            }}
            onSwitchMode={() => setAuthMode("register")}
          />
        ) : (
          <Register
            onSuccess={() => {
              setShowAuthModal(false);
              if (selectedChart) {
                setShowOrderForm(true);
              }
            }}
            onSwitchMode={() => setAuthMode("login")}
          />
        )}
      </Modal>
    </ChartsSection>
  );
};

export default AeronauticalCharts;
