import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import './NavChart.css';

function NavChart() {
  const [funds, setFunds] = useState([]);
  const [selectedFund, setSelectedFund] = useState('');
  const [navData, setNavData] = useState({ dates: [], navs: [], trendLine: [] });

  // Fetch the list of available funds
  useEffect(() => {
    async function fetchFunds() {
      try {
        const response = await fetch('http://localhost:8000/funds');
        const data = await response.json();
        setFunds(data.funds);
        console.log(funds);
      } catch (error) {
        console.error('Error fetching funds:', error);
      }
    }
    fetchFunds();
  }, []);

  // Fetch NAV data when a fund is selected
  useEffect(() => {
    if (selectedFund) {
      async function fetchNavData() {
        try {
          const response = await fetch(`http://localhost:8000/funds/${selectedFund}/nav-history`);
          const data = await response.json();
          setNavData(data);
        } catch (error) {
          console.error('Error fetching NAV data:', error);
        }
      }
      fetchNavData();
    }
  }, [selectedFund]);

  return (
    <div className="nav-chart-container">
      <h2>Select Mutual Fund</h2>
      <select
        value={selectedFund}
        onChange={(e) => setSelectedFund(e.target.value)}
        className="fund-select"
      >
        <option value="">Select a Fund</option>
        {funds.map((fund) => (
          <option>
            {fund.schemeName}
          </option>
        ))}
      </select>

      {selectedFund && navData.dates.length > 0 && (
        <div className="chart">
          <Plot
            data={[
              {
                x: navData.dates,
                y: navData.navs,
                mode: 'lines',
                name: 'NAV',
                line: { color: '#4df8df' },
              },
              {
                x: navData.dates,
                y: navData.trendLine,
                mode: 'lines',
                name: 'Trend Line',
                line: { dash: 'dash', color: 'red' },
              },
            ]}
            layout={{
              title: 'Scheme NAV with Trend Line',
              xaxis: { title: 'Date' },
              yaxis: { title: 'NAV' },
              plot_bgcolor: '#021619',
              paper_bgcolor: '#021619',
              font: { color: '#c1e2dd' },
            }}
          />
        </div>
      )}
    </div>
  );
}

export default NavChart;
