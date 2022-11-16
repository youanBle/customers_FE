import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as LoadingLogp } from "../../loading.svg";
import "./index.css";
//import {request} from '../../utils/fetch'

type CustomerVisitingProps = {
  storeId: string;
  customerId: string;
  postalCode: string;
  totalVisit: number;
  dollarSpend: number;
  productType: number;
  prizm?: number;
};

const Preview = () => {
  const [customerVisiting, setCustomerVisiting] = useState<
    CustomerVisitingProps[]
  >([]);
  const [inputFileName, setInputFileName] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isProcessLoading, setIsProcessLoading] = useState(false);

  const handleInputChange = (str: string) => {
    setInputFileName(str);
  };

  const handlePreviewClick = async () => {
    setIsPreview(true);
    const url = `http://127.0.0.1/custom_store_visiting/preview?path=${inputFileName}`;
    const inital = {
      method: "GET",
      params: null,
      body: null,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      credentials: true,
      responseType: "JSON",
      cache: "no-cache",
    };
    setIsPreviewLoading(true);
    const res = await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCustomerVisiting(data.data);
        setIsPreviewLoading(false);
      });
    //const res = await request(url,{})
  };

  const handleProcessClick = async () => {
    const url = `http://127.0.0.1/custom_store_visiting/all/?path=${inputFileName}`;
    const inital = {
      method: "GET",
      params: null,
      body: null,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      credentials: true,
      responseType: "JSON",
      cache: "no-cache",
    };
    setIsPreviewLoading(true);
    const res = await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setIsProcessed(true);
        console.log(data);
        setCustomerVisiting(data);
        setIsPreviewLoading(false);
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
            disabled={!inputFileName}
            onClick={handlePreviewClick}
          >
            Preview
          </button>
          <button
            disabled={!isPreview || !inputFileName}
            className="btn processBtn"
            onClick={handleProcessClick}
          >
            Process
          </button>
        </div>
      </div>
      <div className="table">
        {isPreviewLoading || isProcessLoading ? (
          <LoadingLogp className="loadingIcon" style={{width:40, height:40}}/>
        ) : (
          <table>
            <tr>
              <th>StoreId</th>
              <th>Customer_ID</th>
              <th>Postal Code</th>
              <th>Total Visit</th>
              <th>Dollar Spend</th>
              <th>Product Type</th>
              {isProcessed && <th>Prizm Code</th>}
            </tr>
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
          </table>
        )}
      </div>
    </div>
  );
};

export default Preview;
