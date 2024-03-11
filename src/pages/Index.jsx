import React, { useState } from "react";
import { Box, Button, Flex, Heading, IconButton, Input, Select, Table, Tbody, Td, Th, Thead, Tr, useToast, VStack } from "@chakra-ui/react";
import { FaEdit, FaTrash, FaFileDownload, FaPlus } from "react-icons/fa";

// Transaction data structure
const initialTransactions = [
  { id: 1, date: "2023-01-01", amount: 500, type: "income", category: "Salary" },
  { id: 2, date: "2023-01-05", amount: 50, type: "expense", category: "Groceries" },
  // Add more dummy data as needed
];

const categories = ["Groceries", "Bills", "Salary", "Entertainment", "Health"];

const Index = () => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [newTransaction, setNewTransaction] = useState({
    date: "",
    amount: "",
    type: "income",
    category: "Groceries",
  });
  const [editingId, setEditingId] = useState(null);
  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction({ ...newTransaction, [name]: value });
  };

  const addTransaction = () => {
    if (!newTransaction.date || !newTransaction.amount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newId = transactions.length + 1;
    setTransactions([...transactions, { ...newTransaction, id: newId }]);
    setNewTransaction({ date: "", amount: "", type: "income", category: "Groceries" });
    toast({
      title: "Success",
      description: "Transaction added",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const editTransaction = (id) => {
    const transaction = transactions.find((t) => t.id === id);
    setNewTransaction({ ...transaction });
    setEditingId(id);
  };

  const updateTransaction = () => {
    setTransactions(transactions.map((t) => (t.id === editingId ? { ...t, ...newTransaction } : t)));
    setNewTransaction({ date: "", amount: "", type: "income", category: "Groceries" });
    setEditingId(null);
    toast({
      title: "Success",
      description: "Transaction updated",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    toast({
      title: "Success",
      description: "Transaction deleted",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const exportTransactions = () => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(transactions))}`;
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "transactions.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const calculateBalance = () => {
    return transactions.reduce((acc, transaction) => {
      if (transaction.type === "income") {
        return acc + Number(transaction.amount);
      } else {
        return acc - Number(transaction.amount);
      }
    }, 0);
  };

  return (
    <VStack spacing={8} p={8}>
      <Heading>Budgeting App</Heading>

      <Flex gap={2} align="center">
        <Input placeholder="Date" type="date" name="date" value={newTransaction.date} onChange={handleInputChange} />
        <Input placeholder="Amount" type="number" name="amount" value={newTransaction.amount} onChange={handleInputChange} />
        <Select name="type" value={newTransaction.type} onChange={handleInputChange}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </Select>
        <Select name="category" value={newTransaction.category} onChange={handleInputChange}>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
        <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={editingId ? updateTransaction : addTransaction}>
          {editingId ? "Update Transaction" : "Add Transaction"}
        </Button>
      </Flex>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Amount</Th>
            <Th>Type</Th>
            <Th>Category</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions.map((transaction) => (
            <Tr key={transaction.id}>
              <Td>{transaction.date}</Td>
              <Td>{transaction.amount}</Td>
              <Td>{transaction.type}</Td>
              <Td>{transaction.category}</Td>
              <Td>
                <IconButton aria-label="Edit" icon={<FaEdit />} onClick={() => editTransaction(transaction.id)} />
                <IconButton aria-label="Delete" icon={<FaTrash />} onClick={() => deleteTransaction(transaction.id)} ml={2} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Box alignSelf="flex-start">
        <Heading size="md">Total Balance: {calculateBalance()}</Heading>
      </Box>

      <Button leftIcon={<FaFileDownload />} onClick={exportTransactions}>
        Export Transactions
      </Button>
    </VStack>
  );
};

export default Index;
