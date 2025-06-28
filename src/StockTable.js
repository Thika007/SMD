import React, { useEffect, useState } from "react";

const getProgressStatus = (balance) => {
  if (balance < 20) {
    return { color: "linear-gradient(135deg, #ff6b6b, #ee5a24)", label: "CRITICAL", textColor: "#fff" };
  } else if (balance < 50) {
    return { color: "linear-gradient(135deg, #feca57, #ff9ff3)", label: "LOW", textColor: "#333" };
  } else {
    return { color: "linear-gradient(135deg, #48dbfb, #0abde3)", label: "GOOD", textColor: "#fff" };
  }
};

const ProgressBar = ({ balance, stock }) => {
  const { color, label, textColor } = getProgressStatus(balance);
  const percentage = stock > 0 ? (balance / stock) * 100 : 0;
  
  return (
    <div style={{ 
      width: 140, 
      background: "linear-gradient(135deg, #f1f2f6, #ddd)", 
      borderRadius: 25, 
      overflow: "hidden", 
      position: "relative",
      boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
      border: "1px solid rgba(255,255,255,0.2)"
    }}>
      <div
        style={{
          width: `${percentage}%`,
          height: 28,
          background: color,
          transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          borderRadius: "25px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
        }}
      />
      <span style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        color: textColor,
        fontWeight: 700,
        fontSize: 11,
        textShadow: "0 1px 2px rgba(0,0,0,0.3)",
        letterSpacing: "0.5px"
      }}>
        {label}
      </span>
    </div>
  );
};

const StockTable = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchStock = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3000/api/items/stock");
        const data = await res.json();
        setStockData(data);
      } catch (err) {
        console.error("Failed to fetch stock data", err);
      }
      setLoading(false);
    };
    fetchStock();
    const interval = setInterval(fetchStock, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => {
        console.error("Error attempting to exit fullscreen:", err);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff",
        fontSize: 18,
        fontWeight: 600
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 15,
          padding: "20px 40px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: 15,
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.2)"
        }}>
          <div style={{
            width: 20,
            height: 20,
            border: "3px solid rgba(255,255,255,0.3)",
            borderTop: "3px solid #fff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }}></div>
          Loading Stock Data...
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "40px 20px",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      position: "relative"
    }}>
      {/* Fullscreen Button */}
      <button
        onClick={toggleFullscreen}
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          zIndex: 1000,
          background: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.3)",
          borderRadius: 12,
          padding: "12px 16px",
          color: "#fff",
          cursor: "pointer",
          backdropFilter: "blur(10px)",
          fontSize: 14,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 8,
          transition: "all 0.3s ease",
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "rgba(255,255,255,0.25)";
          e.target.style.transform = "translateY(-2px)";
          e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "rgba(255,255,255,0.15)";
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
        }}
      >
        <span style={{ fontSize: 16 }}>
          {isFullscreen ? "⤓" : "⤢"}
        </span>
        {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
      </button>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        background: "rgba(255,255,255,0.95)",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.2)"
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #2c3e50, #3498db)",
          padding: "30px 40px",
          borderBottom: "1px solid rgba(255,255,255,0.1)"
        }}>
          <h2 style={{
            margin: 0,
            color: "#fff",
            fontSize: 28,
            fontWeight: 700,
            textAlign: "center",
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            letterSpacing: "1px"
          }}>
            📦 Stock Management Dashboard
          </h2>
          <p style={{
            margin: "10px 0 0 0",
            color: "rgba(255,255,255,0.8)",
            textAlign: "center",
            fontSize: 14,
            fontWeight: 400
          }}>
            Real-time inventory tracking and monitoring
          </p>
        </div>

        {/* Table Container */}
        <div style={{ 
          overflow: "hidden",
          background: "#fff"
        }}>
          <table 
            border="0" 
            cellPadding="0" 
            cellSpacing="0" 
            style={{ 
              width: "100%", 
              background: "#fff",
              borderCollapse: "collapse"
            }}
          >
            <thead>
              <tr style={{ 
                background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                borderBottom: "2px solid #dee2e6"
              }}>
                <th style={{
                  padding: "20px 15px",
                  color: "#2c3e50",
                  fontWeight: 700,
                  fontSize: 14,
                  textAlign: "center",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  borderRight: "1px solid rgba(0,0,0,0.05)"
                }}>No</th>
                <th style={{
                  padding: "20px 25px",
                  color: "#2c3e50",
                  fontWeight: 700,
                  fontSize: 14,
                  textAlign: "left",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  borderRight: "1px solid rgba(0,0,0,0.05)"
                }}>Item Name</th>
                <th style={{
                  padding: "20px 15px",
                  color: "#2c3e50",
                  fontWeight: 700,
                  fontSize: 14,
                  textAlign: "center",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  borderRight: "1px solid rgba(0,0,0,0.05)"
                }}>Stock Qty</th>
                <th style={{
                  padding: "20px 15px",
                  color: "#2c3e50",
                  fontWeight: 700,
                  fontSize: 14,
                  textAlign: "center",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  borderRight: "1px solid rgba(0,0,0,0.05)"
                }}>Issue Qty</th>
                <th style={{
                  padding: "20px 15px",
                  color: "#2c3e50",
                  fontWeight: 700,
                  fontSize: 14,
                  textAlign: "center",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  borderRight: "1px solid rgba(0,0,0,0.05)"
                }}>Balance Qty</th>
                <th style={{
                  padding: "20px 15px",
                  color: "#2c3e50",
                  fontWeight: 700,
                  fontSize: 14,
                  textAlign: "center",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase"
                }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {stockData.map((row, idx) => (
                <tr 
                  key={row.no}
                  style={{
                    background: idx % 2 === 0 ? "#fff" : "rgba(248,249,250,0.5)",
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, #f8f9ff, #e3f2fd)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "rgba(248,249,250,0.5)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <td style={{
                    padding: "20px 15px",
                    textAlign: "center",
                    color: "#666",
                    fontWeight: 600,
                    fontSize: 14,
                    borderRight: "1px solid rgba(0,0,0,0.05)"
                  }}>
                    <div style={{
                      width: 30,
                      height: 30,
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 12,
                      margin: "0 auto"
                    }}>
                      {idx + 1}
                    </div>
                  </td>
                  <td style={{
                    padding: "20px 25px",
                    color: "#2c3e50",
                    fontWeight: 600,
                    fontSize: 15,
                    borderRight: "1px solid rgba(0,0,0,0.05)"
                  }}>
                    {row.itemName}
                  </td>
                  <td style={{
                    padding: "20px 15px",
                    textAlign: "center",
                    color: "#27ae60",
                    fontWeight: 700,
                    fontSize: 16,
                    borderRight: "1px solid rgba(0,0,0,0.05)"
                  }}>
                    {row.stockQty}
                  </td>
                  <td style={{
                    padding: "20px 15px",
                    textAlign: "center",
                    color: "#e74c3c",
                    fontWeight: 700,
                    fontSize: 16,
                    borderRight: "1px solid rgba(0,0,0,0.05)"
                  }}>
                    {row.issueQty}
                  </td>
                  <td style={{
                    padding: "20px 15px",
                    textAlign: "center",
                    color: "#3498db",
                    fontWeight: 700,
                    fontSize: 16,
                    borderRight: "1px solid rgba(0,0,0,0.05)"
                  }}>
                    {row.balanceQty}
                  </td>
                  <td style={{
                    padding: "20px 15px",
                    textAlign: "center"
                  }}>
                    <ProgressBar balance={row.balanceQty} stock={row.stockQty} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{
          padding: "20px 40px",
          background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
          borderTop: "1px solid rgba(0,0,0,0.05)",
          textAlign: "center",
          color: "#666",
          fontSize: 13
        }}>
          <p style={{ margin: 0 }}>
            📊 Total Items: <strong>{stockData.length}</strong> | 
            🔄 Auto-refresh every 30 seconds | 
            ⏰ Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div>
      <StockTable />
    </div>
  );
}

export default App;