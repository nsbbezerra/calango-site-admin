import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Input,
  Select,
  FormControl,
  FormLabel,
  Box,
  LinkBox,
  Flex,
  Text,
  Icon,
  Heading,
  HStack,
  Divider,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
  useToast,
  Spinner,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import { FaCheck, FaLock, FaSearch, FaUnlock, FaUserAlt } from "react-icons/fa";
import MaskedInput from "react-text-mask";
import useFetch from "../hooks/useFetch";
import { mutate as mutateGlobal } from "swr";
import api from "../configs/axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Raffles() {
  const { data, error, mutate } = useFetch("/findDesk");
  const toast = useToast();

  const [search, setSearch] = useState("all");
  const [text, setText] = useState("");
  const [cpf, setCpf] = useState("");

  const [modal, setModal] = useState(false);
  const [justification, setJustification] = useState("");

  const [raffles, setRaffles] = useState([]);
  const [url, setUrl] = useState("");
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
    console.log(data);
    if (data !== undefined) {
      setRaffles(data.raffles);
      setUrl(data.url);
    }
  }, [data]);

  function handleColorBorder(status) {
    switch (status) {
      case "open":
        return "green.400";
      case "cancel":
        return "gray.700";
      case "drawn":
        return "blue.400";
      case "waiting":
        return "orange.400";
      case "refused":
        return "red.600";
      default:
        return "blue.400";
    }
  }

  async function updateRaffle(id, status) {
    if (status === "refused" && justification === "") {
      showToast("Preencha a justificativa", "error", "Erro");
      return false;
    }
    setLoading(true);
    try {
      const response = await api.put(`/manAdmin/${id}`, {
        status: status,
        justify: justification,
      });
      setJustification("");
      const updated = await data.raffles.map((raf) => {
        if (raf.id === id) {
          return { ...raf, status: status, justify: justification };
        }
        return raf;
      });
      let info = { raffles: updated, url: url };
      mutate(info, false);
      mutateGlobal(`/manAdmin/${id}`, info);
      showToast(response.data.message, "success", "Sucesso");
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

  async function finderBySource() {
    if (search === "cpf") {
      if (cpf === "") {
        await setRaffles(data.raffles);
      } else {
        let parse = cpf.replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, "");
        if (parse.length === 11) {
          const frasesFiltradas = await data.raffles.filter(
            (obj) => obj.cpf_client === cpf
          );
          await setRaffles(frasesFiltradas);
        } else {
          showToast("Preencha o CPF corretamente", "warning", "Atenção");
          return false;
        }
      }
    }
    if (search === "all") {
      setRaffles(data.raffles);
    }
    if (search === "name") {
      let termos = await text.split(" ");
      let frasesFiltradas = await data.raffles.filter((frase) => {
        return termos.reduce((resultadoAnterior, termoBuscado) => {
          return resultadoAnterior && frase.name_client.includes(termoBuscado);
        }, true);
      });
      await setRaffles(frasesFiltradas);
    }
    if (search === "title") {
      let termos = await text.split(" ");
      let frasesFiltradas = await data.raffles.filter((frase) => {
        return termos.reduce((resultadoAnterior, termoBuscado) => {
          return resultadoAnterior && frase.name.includes(termoBuscado);
        }, true);
      });
      await setRaffles(frasesFiltradas);
    }
  }

  return (
    <Box>
      <Box bg="purple.400" rounded="lg" p={3} mb={10}>
        <Heading fontSize="lg" color="white">
          Gerenciar Sorteios
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
            <option value="all">Todos os sorteios</option>
            <option value="title">Buscar por título</option>
            <option value="name">Buscar por nome de admin</option>
            <option value="cpf">Buscar por CPF de admin</option>
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
          <Button
            isFullWidth
            leftIcon={<FaSearch />}
            colorScheme="purple"
            onClick={() => finderBySource()}
          >
            Buscar
          </Button>
        </Grid>
      </FormControl>

      <HStack spacing="20px" mt={5}>
        <Flex w="150px">
          <Box w="40px" h="20px" bg="orange.400" rounded="md" />
          <Text fontSize="sm" ml={3}>
            Aguardando
          </Text>
        </Flex>
        <Flex w="150px">
          <Box w="40px" h="20px" bg="green.400" rounded="md" />
          <Text fontSize="sm" ml={3}>
            Liberada
          </Text>
        </Flex>
        <Flex w="150px">
          <Box w="40px" h="20px" bg="red.600" rounded="md" />
          <Text fontSize="sm" ml={3}>
            Recusada
          </Text>
        </Flex>
        <Flex w="150px">
          <Box w="40px" h="20px" bg="gray.700" rounded="md" />
          <Text fontSize="sm" ml={3}>
            Cancelada
          </Text>
        </Flex>
        <Flex w="150px">
          <Box w="40px" h="20px" bg="blue.400" rounded="md" />
          <Text fontSize="sm" ml={3}>
            Sorteada
          </Text>
        </Flex>
      </HStack>

      <Box rounded="lg" p={5} borderWidth="1px" mt={5}>
        {raffles.length === 0 ? (
          <Flex justify="center" align="center">
            <Spinner size="xl" colorScheme="purple" />
          </Flex>
        ) : (
          <Grid
            templateColumns="repeat(auto-fit, minmax(220px, 220px))"
            gap="30px"
            justifyContent="center"
          >
            {raffles.map((raf) => (
              <Box w="230px" key={raf.id}>
                <LinkBox
                  rounded="lg"
                  overflow="hidden"
                  w="230px"
                  bg="white"
                  shadow="lg"
                  borderWidth="5px"
                  borderColor={handleColorBorder(raf.status)}
                >
                  <Box w="220px" h="220px">
                    <Image
                      src={`${url}/${raf.thumbnail}`}
                      w={"220px"}
                      h={"220px"}
                      alt="PMW Rifas, rifas online"
                    />
                  </Box>
                  <Box p={2} w="260px">
                    <Heading
                      color="purple.400"
                      fontSize="md"
                      isTruncated
                      noOfLines={1}
                      w="200px"
                    >
                      {raf.name}
                    </Heading>

                    <Text fontSize="xs" mt={2}>
                      Sorteio:{" "}
                      <strong>
                        {format(
                          new Date(raf.draw_date),
                          "dd 'de' MMMM', às ' HH:mm'h'",
                          { locale: ptBR }
                        )}
                      </strong>
                    </Text>
                    <Flex align="center" mt={1}>
                      <Text fontWeight="300" mr={2}>
                        R$
                      </Text>
                      <Text fontWeight="800">
                        {parseFloat(raf.raffle_value).toLocaleString("pt-br", {
                          minimumFractionDigits: 2,
                        })}
                      </Text>
                    </Flex>
                    <Divider mt={1} mb={1} />
                    <Flex align="center" fontSize="xs">
                      <Icon as={FaUserAlt} mr={2} />
                      <Text w="180px" isTruncated noOfLines={1}>
                        {raf.name_client}
                      </Text>
                    </Flex>
                  </Box>
                </LinkBox>
                {raf.status === "waiting" && (
                  <Grid templateColumns="1fr 1fr" gap="10px" mt={2}>
                    <Popover>
                      <PopoverTrigger>
                        <Button
                          size="sm"
                          shadow="md"
                          colorScheme="green"
                          leftIcon={<FaUnlock />}
                        >
                          Liberar
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent shadow="lg" _focus={{ outline: "none" }}>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>Liberação</PopoverHeader>
                        <PopoverBody>Deseja liberar este sorteio?</PopoverBody>
                        <PopoverFooter d="flex" justifyContent="flex-end">
                          <Button
                            leftIcon={<FaUnlock />}
                            colorScheme="green"
                            size="sm"
                            isLoading={loading}
                            onClick={() => updateRaffle(raf.id, "open")}
                          >
                            Liberar
                          </Button>
                        </PopoverFooter>
                      </PopoverContent>
                    </Popover>

                    <Popover>
                      <PopoverTrigger>
                        <Button
                          size="sm"
                          shadow="md"
                          colorScheme="red"
                          leftIcon={<FaLock />}
                        >
                          Recusar
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent shadow="lg" _focus={{ outline: "none" }}>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>Justificativa</PopoverHeader>
                        <PopoverBody>
                          <Textarea
                            rows={4}
                            focusBorderColor="purple.400"
                            resize="none"
                            value={justification}
                            onChange={(e) =>
                              setJustification(e.target.value.toUpperCase())
                            }
                          />
                        </PopoverBody>
                        <PopoverFooter d="flex" justifyContent="flex-end">
                          <Button
                            leftIcon={<FaLock />}
                            colorScheme="red"
                            size="sm"
                            isLoading={loading}
                            onClick={() => updateRaffle(raf.id, "refused")}
                          >
                            Recusar
                          </Button>
                        </PopoverFooter>
                      </PopoverContent>
                    </Popover>
                  </Grid>
                )}
                {raf.status === "open" && (
                  <Grid templateColumns="1fr" gap="10px" mt={2}>
                    <Popover>
                      <PopoverTrigger>
                        <Button
                          size="sm"
                          shadow="md"
                          colorScheme="red"
                          leftIcon={<FaLock />}
                        >
                          Bloquear
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent shadow="lg" _focus={{ outline: "none" }}>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>Justificativa</PopoverHeader>
                        <PopoverBody>
                          <Textarea
                            rows={4}
                            focusBorderColor="purple.400"
                            resize="none"
                            value={justification}
                            onChange={(e) =>
                              setJustification(e.target.value.toUpperCase())
                            }
                          />
                        </PopoverBody>
                        <PopoverFooter d="flex" justifyContent="flex-end">
                          <Button
                            leftIcon={<FaLock />}
                            colorScheme="red"
                            size="sm"
                            isLoading={loading}
                            onClick={() => updateRaffle(raf.id, "refused")}
                          >
                            Bloquear
                          </Button>
                        </PopoverFooter>
                      </PopoverContent>
                    </Popover>
                  </Grid>
                )}
                {raf.status === "refused" && (
                  <Grid templateColumns="1fr" gap="10px" mt={2}>
                    <Popover>
                      <PopoverTrigger>
                        <Button
                          size="sm"
                          shadow="md"
                          colorScheme="green"
                          leftIcon={<FaUnlock />}
                        >
                          Liberar
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent shadow="lg" _focus={{ outline: "none" }}>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>Liberação</PopoverHeader>
                        <PopoverBody>Deseja liberar este sorteio?</PopoverBody>
                        <PopoverFooter d="flex" justifyContent="flex-end">
                          <Button
                            leftIcon={<FaUnlock />}
                            colorScheme="green"
                            size="sm"
                            isLoading={loading}
                            onClick={() => updateRaffle(raf.id, "open")}
                          >
                            Liberar
                          </Button>
                        </PopoverFooter>
                      </PopoverContent>
                    </Popover>
                  </Grid>
                )}
                {raf.status === "drawn" && (
                  <Grid templateColumns="1fr" gap="10px" mt={2}>
                    <Button
                      size="sm"
                      shadow="md"
                      colorScheme="green"
                      isDisabled
                    >
                      Sorteada
                    </Button>
                  </Grid>
                )}
                {raf.status === "cancel" && (
                  <Grid templateColumns="1fr" gap="10px" mt={2}>
                    <Button size="sm" shadow="md" colorScheme="gray" isDisabled>
                      Cancelada
                    </Button>
                  </Grid>
                )}
              </Box>
            ))}
          </Grid>
        )}
      </Box>
      <Modal isOpen={modal} onClose={() => setModal(false)} size="2xl">
        <ModalOverlay />
        <ModalContent borderWidth="3px" borderColor="green.400">
          <ModalHeader>Justificativa</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Justificativa para o bloqueio</FormLabel>
              <Textarea
                rows={4}
                focusBorderColor="purple.400"
                resize="none"
                value={justification}
                onChange={(e) => setJustification(e.target.value.toUpperCase())}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button leftIcon={<FaCheck />} colorScheme="green">
              Finalizar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
