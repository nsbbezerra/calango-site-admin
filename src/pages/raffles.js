import React, { useEffect, useState, useMemo } from "react";
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import {
  FaCheck,
  FaCogs,
  FaEdit,
  FaImage,
  FaLock,
  FaSearch,
  FaTrash,
  FaUnlock,
  FaUserAlt,
} from "react-icons/fa";
import { MdKeyboardArrowUp } from "react-icons/md";
import MaskedInput from "react-text-mask";
import useFetch from "../hooks/useFetch";
import { mutate as mutateGlobal } from "swr";
import api from "../configs/axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { File, InputFile } from "../styles/uploader";

export default function Raffles() {
  const { data, error, mutate } = useFetch("/findDesk");
  const toast = useToast();

  const [search, setSearch] = useState("all");
  const [text, setText] = useState("");
  const [cpf, setCpf] = useState("");

  const [modal, setModal] = useState(false);
  const [justification, setJustification] = useState("");
  const [modalImage, setModalImage] = useState(false);
  const [imageRaffle, setImageRaffle] = useState("");
  const [idRaffle, setIdRaffle] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);

  const [raffles, setRaffles] = useState([]);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [modalInfo, setModalInfo] = useState("");
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [alerta, setAlerta] = useState(false);

  const previewThumbnail = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  async function removeThumbnail() {
    await URL.revokeObjectURL(thumbnail);
    setThumbnail(null);
  }

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

  async function handleUpdateImage(id) {
    const result = await data.raffles.find((obj) => obj.id === id);
    setImageRaffle(result.thumbnail);
    setIdRaffle(result.id);
    setModalImage(true);
  }

  async function sendUpdateImage() {
    if (thumbnail === null) {
      showToast("Selecione uma imagem para enviar", "warning", "Atenção");
      return false;
    }
    setLoadingImage(true);
    let imageData = new FormData();
    imageData.append("thumbnail", thumbnail);
    try {
      const response = await api.put(`/raffleEditImage/${idRaffle}`, imageData);
      const updated = await data.raffles.map((raff) => {
        if (raff.id === idRaffle) {
          return { ...raff, thumbnail: response.data.newRaffle[0].thumbnail };
        }
        return raff;
      });

      let info = { raffles: updated, url: url };
      mutate(info, false);
      mutateGlobal(`/raffleEditImage/${idRaffle}`, info);
      setThumbnail(null);
      removeThumbnail();
      setModalImage(false);
      setLoadingImage(false);
      showToast(response.data.message, "success", "Sucesso");
    } catch (error) {
      setLoadingImage(false);
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

  async function handleUpdateInfo(id) {
    const result = await data.raffles.find((obj) => obj.id === id);
    setName(result.name);
    setDescription(result.description);
    setIdRaffle(result.id);
    setModalInfo(true);
  }

  async function sendUpdateInfo() {
    if (name === "") {
      showToast("Insira um nome", "warning", "Atenção");
      return false;
    }
    if (description === "") {
      showToast("Insira uma descrição", "warning", "Atenção");
      return false;
    }
    setLoadingInfo(true);
    try {
      const response = await api.put(`/raffleEditInfo/${idRaffle}`, {
        name,
        description,
      });
      const updated = await data.raffles.map((raff) => {
        if (raff.id === idRaffle) {
          return {
            ...raff,
            name: response.data.newRaffle[0].name,
            description: response.data.newRaffle[0].description,
          };
        }
        return raff;
      });

      let info = { raffles: updated, url: url };
      mutate(info, false);
      mutateGlobal(`/raffleEditInfo/${idRaffle}`, info);
      showToast(response.data.message, "success", "Sucesso");
      setModalInfo(false);
      setLoadingInfo(false);
    } catch (error) {
      setLoadingInfo(false);
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

  function handleRemove(id) {
    setIdRaffle(id);
    setAlerta(true);
  }

  async function sendRemoveRaffle() {
    setLoadingInfo(true);
    try {
      const response = await api.delete(`/raffleDelete/${idRaffle}`);
      const newRaffles = await data.raffles.filter(
        (obj) => obj.id !== idRaffle
      );
      setLoadingInfo(false);
      setAlerta(false);
      setRaffles(newRaffles);
      showToast(response.data.message, "success", "Sucesso");
    } catch (error) {
      setLoadingInfo(false);
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
                  <Grid templateColumns="1fr 1fr" gap="10px" mt={2}>
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

                    <Menu placement="top">
                      <MenuButton
                        as={Button}
                        rightIcon={<MdKeyboardArrowUp />}
                        size="sm"
                        colorScheme="purple"
                        isFullWidth
                        variant="outline"
                      >
                        Opções
                      </MenuButton>
                      <MenuList
                        shadow="lg"
                        borderWidth="2px"
                        borderColor="green.400"
                      >
                        <MenuItem
                          _active={{ bg: "purple.100", color: "white" }}
                          _focus={{ bg: "transparent" }}
                          _hover={{ bg: "purple.100", color: "white" }}
                          icon={<FaEdit />}
                          onClick={() => handleUpdateInfo(raf.id)}
                        >
                          Alterar Informações
                        </MenuItem>
                        <MenuItem
                          _active={{ bg: "purple.100", color: "white" }}
                          _focus={{ bg: "transparent" }}
                          _hover={{ bg: "purple.100", color: "white" }}
                          icon={<FaImage />}
                          onClick={() => handleUpdateImage(raf.id)}
                        >
                          Alterar Imagem
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Grid>
                )}
                {raf.status === "refused" && (
                  <Menu placement="top">
                    <MenuButton
                      as={Button}
                      rightIcon={<MdKeyboardArrowUp />}
                      isFullWidth
                      size="sm"
                      mt={2}
                      colorScheme="purple"
                      leftIcon={<FaCogs />}
                      variant="outline"
                    >
                      Opções
                    </MenuButton>
                    <MenuList
                      shadow="lg"
                      borderWidth="2px"
                      borderColor="green.400"
                    >
                      <MenuItem
                        onClick={() => updateRaffle(raf.id, "open")}
                        _active={{ bg: "purple.100", color: "white" }}
                        _focus={{ bg: "transparent" }}
                        _hover={{ bg: "purple.100", color: "white" }}
                        icon={<FaUnlock />}
                      >
                        Liberar
                      </MenuItem>
                      <MenuItem
                        _active={{ bg: "purple.100", color: "white" }}
                        _focus={{ bg: "transparent" }}
                        _hover={{ bg: "purple.100", color: "white" }}
                        icon={<FaTrash />}
                        onClick={() => handleRemove(raf.id)}
                      >
                        Excluir
                      </MenuItem>
                    </MenuList>
                  </Menu>
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

      <Modal isOpen={modalImage} onClose={() => setModalImage(false)}>
        <ModalOverlay />
        <ModalContent maxW="3xl">
          <ModalHeader>Alterar Imagem</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid
              templateColumns="300px 300px"
              gap="30px"
              justifyContent="center"
            >
              <FormControl>
                <FormLabel>Imagem Atual</FormLabel>
                <Box w="300px" h="300px" overflow="hidden" rounded="lg">
                  <Image src={`${url}/${imageRaffle}`} w="300px" h="300px" />
                </Box>
              </FormControl>
              <FormControl>
                <FormLabel>Nova Imagem</FormLabel>
                {thumbnail ? (
                  <Box w="300px" h="300px" rounded="lg" overflow="hidden">
                    <Image w="300px" h="300px" src={previewThumbnail} />
                    <IconButton
                      icon={<FaTrash />}
                      rounded="full"
                      colorScheme="red"
                      mt={-20}
                      ml="130px"
                      shadow="dark-lg"
                      onClick={() => removeThumbnail()}
                    />
                  </Box>
                ) : (
                  <InputFile lar={300} alt={300}>
                    <File
                      type="file"
                      onChange={(event) => setThumbnail(event.target.files[0])}
                      id="image"
                    />
                    <FaImage style={{ fontSize: 50, marginBottom: 20 }} />
                    <p style={{ fontSize: "13px" }}>
                      Insira uma imagem 220px x 220px com no máximo 300kb
                    </p>
                  </InputFile>
                )}
              </FormControl>
            </Grid>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="green"
              leftIcon={<FaEdit />}
              onClick={() => sendUpdateImage()}
              isLoading={loadingImage}
            >
              Alterar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={modalInfo} onClose={() => setModalInfo(false)}>
        <ModalOverlay />
        <ModalContent maxW="3xl">
          <ModalHeader>Alterar Informações</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Nome do Sorteio</FormLabel>
              <Input
                focusBorderColor="purple.400"
                value={name}
                onChange={(e) => setName(e.target.value.toUpperCase())}
              />
            </FormControl>

            <FormControl mt={3}>
              <FormLabel>Descrição</FormLabel>
              <Textarea
                focusBorderColor="purple.400"
                value={description}
                onChange={(e) => setDescription(e.target.value.toUpperCase())}
                rows={4}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="green"
              leftIcon={<FaEdit />}
              onClick={() => sendUpdateInfo()}
              isLoading={loadingInfo}
            >
              Alterar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog isOpen={alerta} onClose={() => setAlerta(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Excluir Sorteio
            </AlertDialogHeader>

            <AlertDialogBody>Deseja excluir este sorteio?</AlertDialogBody>

            <AlertDialogFooter>
              <Button
                colorScheme="green"
                variant="outline"
                onClick={() => setAlerta(false)}
              >
                Não
              </Button>
              <Button
                colorScheme="green"
                ml={3}
                isLoading={loadingInfo}
                onClick={() => sendRemoveRaffle()}
              >
                Sim
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
