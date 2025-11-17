"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./page.module.css";
import { useSearchParams } from "next/navigation";

const apiURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6002";

const TransactionForm = () => {
  const searchParams = useSearchParams();

  // Extract query params
  const receiverAccountNumber = searchParams.get("toAccount") || "";
  const amountFromQuery = searchParams.get("amount") || "";
  const purchaseId = searchParams.get("purchaseId") || "";
  const email = searchParams.get("email") || "";
  const booksQuery = searchParams.get("books") || ""; // could be "id1,id2,id3"

  // Parse books into array
  const bookIds = booksQuery.split(",").filter(Boolean);

  const [formData, setFormData] = useState({
    senderAccountNumber: "",
    senderPin: "",
    amount: amountFromQuery,
    type: "transfer",
  });

  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!bookIds.length) {
      alert("No book selected for purchase.");
      return;
    }

    const isConfirmed = window.confirm(
      `You are about to pay ${amountFromQuery} Tk for ${bookIds.length} book(s). Are you sure?`
    );
    if (!isConfirmed) return;

    try {
      const payload = {
        senderAccountNumber: formData.senderAccountNumber,
        senderPin: formData.senderPin,
        receiverAccountNumber,
        amount: amountFromQuery,
        type: "transfer",
        purchaseId,
        email,
        bookIds, // pass as array for multi-book support
      };

      const res = await axios.post(`${apiURL}/api/transaction/create`, payload);

      if (res.data.redirectURL) {
        window.location.href = res.data.redirectURL; // redirect to confirmation/payment page
      } else {
        setMessage(res.data.message || "Transaction initiated.");
      }

    } catch (err: any) {
      setMessage(err.response?.data?.message || "Transaction failed.");
      console.error("Transaction error:", err);
    }
  };

  return (
    <div className={styles.transactionPage}>
      <div className={styles.transactionContainer}>
        <h1 className={styles.transactionTitle}>Complete Your Payment</h1>

        <form className={styles.transactionForm} onSubmit={handleSubmit}>
          <p>
            <strong>Amount:</strong> {amountFromQuery} Tk
          </p>

          <label htmlFor="senderAccountNumber">Your Account Number:</label>
          <input
            type="text"
            name="senderAccountNumber"
            value={formData.senderAccountNumber}
            onChange={handleChange}
            required
          />

          <label htmlFor="senderPin">PIN:</label>
          <input
            type="password"
            name="senderPin"
            value={formData.senderPin}
            onChange={handleChange}
            required
          />

          <button type="submit" className={styles.submitButton}>
            Proceed to Confirm
          </button>
        </form>

        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

export default TransactionForm;
