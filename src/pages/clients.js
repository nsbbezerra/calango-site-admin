import React, { useState, useEffect } from "react";
import {
  Grid,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Box,
  Switch,
  HStack,
  Icon,
  Text,
  Heading,
  useToast,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import MaskedInput from "react-text-mask";
import { FaSearch, FaWhatsapp } from "react-icons/fa";
import useFetch from "../hooks/useFetch";
import { mutate as mutateGlobal } from "swr";
import api from "../configs/axios";

export default function Clients() {
  const { data, error, mutate } = useFetch("/clients");
  const toast = useToast();

  const [search, setSearch] = useState("all");
  const [text, setText] = useState("");
  const [cpf, setCpf] = useState("");

  const [clients, setClients] = useState([]);

  function showToast(message, status, title) {
    toast({
      title: title,
      description: message,
      status: status,
      position: "bottom-right",
    });
  }

  useEffect(() => {
    console.log("DATA", data);
    if (data !== undefined) {
      setClients(data);
    }
  }, [data]);

  return (
    <>
      <Box bg="purple.400" rounded="lg" p={3} mb={10}>
        <Heading fontSize="lg" color="white">
          Gerenciar Clientes
        </Heading>
      </Box>
      <FormControl>
        <FormLabel>Escolha uma opção de busca:</FormLabel>
        <Grid templateColumns="1fr 3fr 1fr" gap="20px">
          <Select
            placeholder="Selecione uma opção"
            focusBorderColor="purple.400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          >
            <option value="all">Todos os clientes</option>
            <option value="name">Buscar por nome</option>
            <option value="cpf">Buscar por CPF</option>
          </Select>

          {search === "cpf" ? (
            <MaskedInput
              mask={[
                /[0-9]/,
                /\d/,
                /\d/,
                ".",
                /\d/,
                /\d/,
                /\d/,
                ".",
                /\d/,
                /\d/,
                /\d/,
                "-",
                /\d/,
                /\d/,
              ]}
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="Digite para buscar"
              id="cpf"
              render={(ref, props) => (
                <Input
                  ref={ref}
                  {...props}
                  focusBorderColor={"purple.400"}
                  isDisabled={search === "all" ? true : false}
                />
              )}
            />
          ) : (
            <Input
              placeholder="Digite para buscar"
              focusBorderColor="purple.400"
              isDisabled={search === "all" ? true : false}
              value={text}
              onChange={(e) => setText(e.target.value.toUpperCase())}
            />
          )}
          <Button isFullWidth leftIcon={<FaSearch />} colorScheme="purple">
            Buscar
          </Button>
        </Grid>
      </FormControl>

      <Box rounded="lg" p={5} borderWidth="1px" mt={10}>
        {clients.length === 0 ? (
          <Flex justify="center" align="center">
            <Spinner size="xl" colorScheme="purple" />
          </Flex>
        ) : (
          <Table size="sm">
            <Thead fontWeight="700">
              <Tr>
                <Td w="6%" textAlign="center">
                  Criar
                </Td>
                <Td w="6%" textAlign="center">
                  Comprar
                </Td>
                <Td w="40%">Nome</Td>
                <Td>CPF</Td>
                <Td>Email</Td>
                <Td w="13%">Telefone</Td>
              </Tr>
            </Thead>

            <Tbody>
              {clients.map((cli) => (
                <Tr key={cli.id}>
                  <Td w="6%" textAlign="center">
                    <Switch
                      colorScheme="purple"
                      defaultChecked={cli.active_admin}
                    />
                  </Td>
                  <Td w="6%" textAlign="center">
                    <Switch
                      colorScheme="purple"
                      defaultChecked={cli.active_client}
                    />
                  </Td>
                  <Td w="40%">{cli.name}</Td>
                  <Td>{cli.cpf}</Td>
                  <Td>{cli.email}</Td>
                  <Td w="13%">
                    <HStack>
                      <Icon as={FaWhatsapp} />
                      <Text>{cli.phone}</Text>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
    </>
  );
}
