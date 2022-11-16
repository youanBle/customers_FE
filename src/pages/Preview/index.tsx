import React, { useState } from "react";
import { ReactComponent as LoadingLogp } from "../../loading.svg";
import Barchart from './components/Barchart/index'
import "./index.css";

type CustomerVisitingProps = {
  storeId: string;
  customerId: string;
  postalCode: string;
  totalVisit: number;
  dollarSpend: number;
  productType: number;
  prizm?: number;
};

type StoreInfoProps = {
  // visits: number;
  dollarSpend: number;
};

const Preview = () => {
  const [customerVisiting, setCustomerVisiting] = useState<
    CustomerVisitingProps[]
  >([]);
  const [inputFileName, setInputFileName] = useState("");
  const [showTableHeader, setShowTableHeader] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isProcessLoading, setIsProcessLoading] = useState(false);
  const [StoreData, setStoreData] = useState<any[]>([]);

  const handleInputChange = (str: string) => {
    setInputFileName(str);
  };

  const accumulateDataForEachStore = (data: CustomerVisitingProps[]) => {
    const storeMap: Record<string, StoreInfoProps> = {};
    data.forEach((record) => {
      if (record.storeId in storeMap) {
        storeMap[record.storeId].dollarSpend += +record.dollarSpend;
        // storeMap[record.storeId].visits += +record.totalVisit;
      } else {
        storeMap[record.storeId] = {
          dollarSpend: +record.dollarSpend,
          // visits: +record.totalVisit,
        };
      }
    });
    const source = Object.keys(storeMap).map((key) => {
      return [key, storeMap[key].dollarSpend.toFixed(2)];
    });
    return [["storeId", "Total Dollar Spend"], ...source];
  };

  const handlePreviewClick = async () => {
    setShowTableHeader(true);
    const url = `http://127.0.0.1/custom_store_visiting/preview?path=${inputFileName}`;
    setIsPreviewLoading(true);
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCustomerVisiting(data.data);
        setIsPreviewLoading(false);
      });
  };

  const handleProcessClick = async () => {
    setShowTableHeader(true);
    const url = `http://127.0.0.1/custom_store_visiting/all/?path=${inputFileName}`;
    setIsProcessLoading(true);
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setIsProcessed(true);
        setCustomerVisiting(data);
        setStoreData(accumulateDataForEachStore(data));
        setIsProcessLoading(false);
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  return (
    <div className="container">
      <div className="searchBar">
        <div className="input">
          <span>Input File</span>
          <input
            onChange={(e) => {
              handleInputChange(e.target.value);
            }}
            placeholder="path/to/file1.csv"
            required
          ></input>
        </div>

        <div className="btns">
          <button
            className="btn previewBtn"
            disabled={!inputFileName || isProcessLoading || isPreviewLoading}
            onClick={handlePreviewClick}
          >
            Preview
          </button>
          <button
            disabled={!inputFileName || isProcessLoading || isPreviewLoading}
            className="btn processBtn"
            onClick={handleProcessClick}
          >
            Process
          </button>
        </div>
      </div>
      <div className="table">
        {isPreviewLoading || isProcessLoading ? (
          <LoadingLogp
            className="loadingIcon"
            style={{ width: 40, height: 40 }}
          />
        ) : (
          <>
            <table>
              {showTableHeader && (
                <tr>
                  <th>StoreId</th>
                  <th>Customer_ID</th>
                  <th>Postal Code</th>
                  <th>Total Visit</th>
                  <th>Dollar Spend</th>
                  <th>Product Type</th>
                  {isProcessed && <th>Prizm Code</th>}
                </tr>
              )}

              <tbody>
                {customerVisiting.length > 0 &&
                  customerVisiting.map((customer) => {
                    return (
                      <tr key={customer.customerId}>
                        <td>{customer.storeId}</td>
                        <td>{customer.customerId}</td>
                        <td>{customer.postalCode}</td>
                        <td>{customer.totalVisit}</td>
                        <td>{customer.dollarSpend}</td>
                        <td>{customer.productType}</td>
                        {isProcessed && <td>{customer.prizm}</td>}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            
            
          </>
        )}
      </div>
      <div className="chart">
         {isProcessed && <Barchart data={StoreData}/>}
      </div>
     
    </div>
  );
};

export default Preview;
