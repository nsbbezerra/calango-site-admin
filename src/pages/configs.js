import React, { useEffect, useState } from "react";
import {
  Heading,
  Box,
  Grid,
  FormLabel,
  FormControl,
  Input,
  InputLeftElement,
  InputGroup,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Divider,
  Button,
  useToast,
} from "@chakra-ui/react";
import { FaSave, FaWhatsapp } from "react-icons/fa";
import MaskedInput from "react-text-mask";
import useFetch from "../hooks/useFetch";
import { mutate as mutateGlobal } from "swr";
import api from "../configs/axios";

export default function Configs() {
  const { data, error, mutate } = useFetch("/configs");
  const toast = useToast();

  const [phone, setPhone] = useState("");
  const [max_numbers, setMax_numbers] = useState("0");
  const [raffle_value, setRaffle_value] = useState("0");
  const [id, setId] = useState(null);

  const [loading, setLoading] = useState(false);

  function showToast(message, status, title) {
    toast({
      title: title,
      description: message,
      status: status,
      position: "bottom-right",
    });
  }

  if (error) {
    if (error.message === "Network Error") {
      alert(
        "Sem conexão com o servidor, verifique sua conexão com a internet."
      );
    } else {
      const statusCode = error.response.status || 400;
      const typeError =
        error.response.data.message || "Ocorreu um erro ao buscar";
      const errorMesg = error.response.data.err || statusCode;
      const errorMessageFinal = `${typeError} + Cod: ${errorMesg}`;
      showToast(
        errorMessageFinal,
        "error",
        statusCode === 401 ? "Erro Autorização" : "Erro no Cadastro"
      );
    }
  }

  useEffect(() => {
    if (data !== undefined) {
      setPhone(data.admin_phone);
      setMax_numbers(data.max_numbers);
      setRaffle_value(data.raffle_value);
      setId(data.id);
    }
  }, [data]);

  async function saveConfigs() {
    if (!id) {
      showToast("Nenhuma configuração para salvar", "error", "Erro");
      return false;
    }
    setLoading(true);
    try {
      const response = await api.put(`/configs/${id}`, {
        admin_phone: phone,
        max_numbers: parseInt(max_numbers),
        raffle_value: parseFloat(raffle_value),
      });
      console.log(response);
      let mute = {
        admin_phone: response.data.configs[0].admin_phone,
        max_numbers: response.data.configs[0].max_numbers,
        raffle_value: response.data.configs[0].raffle_value,
      };
      mutate(mute, false);
      mutateGlobal(`/configs/${id}`, {
        id: id,
        admin_phone: response.data.configs[0].admin_phone,
        max_numbers: response.data.configs[0].max_numbers,
        raffle_value: response.data.configs[0].raffle_value,
      });
      showToast(response.data.message, "success", "Suceso");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const statusCode = error.response.status || 400;
      const typeError =
        error.response.data.message || "Ocorreu um erro ao buscar";
      const errorMesg = error.response.data.err || statusCode;
      const errorMessageFinal = `${typeError} + Cod: ${errorMesg}`;
      showToast(
        errorMessageFinal,
        "error",
        statusCode === 401 ? "Erro Autorização" : "Erro no Cadastro"
      );
    }
  }

  return (
    <>
      <Box bg="purple.400" rounded="lg" p={3} mb={10}>
        <Heading fontSize="lg" color="white">
          Configurações Globais do Site
        </Heading>
      </Box>

      <Box borderWidth="1px" p={5} rounded="lg">
        <Grid templateColumns="repeat(3, 1fr)" gap="20px">
          <FormControl>
            <FormLabel>Whatsapp do Administrador</FormLabel>
            <MaskedInput
              mask={[
                "(",
                /[0-9]/,
                /\d/,
                ")",
                " ",
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                "-",
                /\d/,
                /\d/,
                /\d/,
                /\d/,
              ]}
              placeholder="Telefone"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              render={(ref, props) => (
                <InputGroup>
                  <InputLeftElement children={<FaWhatsapp />} />
                  <Input
                    placeholder="Telefone"
                    ref={ref}
                    {...props}
                    focusBorderColor="purple.400"
                  />
                </InputGroup>
              )}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Quantidade Máxima de Números</FormLabel>
            <NumberInput
              focusBorderColor="purple.400"
              step={1}
              value={max_numbers}
              onChange={(e) => setMax_numbers(e)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>Valor por Sorteio</FormLabel>
            <NumberInput
              focusBorderColor="purple.400"
              step={0.01}
              value={raffle_value}
              onChange={(e) => setRaffle_value(e)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </Grid>

        <Divider mt={5} mb={5} />

        <Button
          leftIcon={<FaSave />}
          colorScheme="purple"
          size="lg"
          isLoading={loading}
          onClick={() => saveConfigs()}
        >
          Salvar
        </Button>
      </Box>
    </>
  );
}
