import React, { useState, useEffect } from "react";
import {
  Flex,
  Image,
  Divider,
  Button,
  Icon,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  FormLabel,
  FormControl,
  Input,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  HStack,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import { FaReceipt, FaUserAlt, FaTools, FaHome, FaSave } from "react-icons/fa";
import { AiOutlineStop, AiOutlineReload } from "react-icons/ai";
import Logo from "../assets/logo.svg";
import { useHistory } from "react-router-dom";

const remote = window.require("electron").remote;

export default function HeaderApp() {
  const { push } = useHistory();
  function routering(rt) {
    push(rt);
  }

  const [route, setRoute] = useState("");
  const [modal, setModal] = useState(true);
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    findRoute();
  }, []);

  async function findRoute() {
    const rt = await localStorage.getItem("route");
    if (rt) {
      setModal(false);
      setRoute(rt);
    } else {
      setModal(true);
    }
  }

  async function saveRoute() {
    await localStorage.setItem("route", route);
    setModal(false);
    setAlert(true);
  }

  function closeWindow() {
    remote.getCurrentWindow().reload();
  }

  return (
    <>
      <Flex
        bg="whiteAlpha.100"
        h="85px"
        align="center"
        borderBottomColor="green.400"
        borderBottomWidth="5px"
        pl={10}
        pr={10}
        shadow="lg"
      >
        <Flex>
          <Image src={Logo} h="70px" />
        </Flex>
        <Divider orientation="vertical" mr={10} ml={10} />
        <Flex h="80px" w="100%" align="center">
          <Button
            colorScheme="purple"
            size="lg"
            h="68px"
            variant="outline"
            w="160px"
            onClick={() => routering("/")}
          >
            <Flex direction="column" justify="center" align="center">
              <Icon as={FaHome} fontSize="3xl" />
              <Text fontSize="sm" mt={2}>
                Início
              </Text>
            </Flex>
          </Button>
          <Button
            colorScheme="purple"
            size="lg"
            h="68px"
            variant="outline"
            w="160px"
            onClick={() => routering("/raffles")}
            ml={5}
          >
            <Flex direction="column" justify="center" align="center">
              <Icon as={FaReceipt} fontSize="3xl" />
              <Text fontSize="sm" mt={2}>
                Sorteios
              </Text>
            </Flex>
          </Button>
          <Button
            colorScheme="purple"
            size="lg"
            h="68px"
            variant="outline"
            ml={5}
            w="160px"
            onClick={() => routering("/clients")}
          >
            <Flex direction="column" justify="center" align="center">
              <Icon as={FaUserAlt} fontSize="3xl" />
              <Text fontSize="sm" mt={2}>
                Clientes
              </Text>
            </Flex>
          </Button>
          <Button
            colorScheme="purple"
            size="lg"
            h="68px"
            variant="outline"
            ml={5}
            w="160px"
            onClick={() => routering("/configs")}
          >
            <Flex direction="column" justify="center" align="center">
              <Icon as={FaTools} fontSize="3xl" />
              <Text fontSize="sm" mt={2}>
                Configurações
              </Text>
            </Flex>
          </Button>

          <HStack ml={5}>
            <InputGroup>
              <InputLeftAddon children="Rota" />
              <Input
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                focusBorderColor="purple.400"
              />
            </InputGroup>
            <Button
              leftIcon={<FaSave />}
              w="130px"
              onClick={() => saveRoute()}
              colorScheme="green"
            >
              Salvar
            </Button>
          </HStack>
        </Flex>
      </Flex>

      <Modal
        isOpen={modal}
        size="xl"
        closeOnEsc={false}
        closeOnOverlayClick={false}
        isCentered
      >
        <ModalOverlay />
        <ModalContent borderWidth="3px" borderColor="green.400">
          <ModalHeader>Configurações do Servidor</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Insira a rota para o servidor:</FormLabel>
              <Input
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                placeholder="Rota para o servidor"
                focusBorderColor="purple.400"
                size="lg"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              leftIcon={<FaSave />}
              colorScheme="green"
              onClick={() => saveRoute()}
            >
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog isOpen={alert} onClose={() => setAlert(false)} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent borderWidth="3px" borderColor="green.400">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Salvar Rota
            </AlertDialogHeader>

            <AlertDialogBody>
              Para que as alterações da Rota tenham efeito reinicie a aplicação.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                colorScheme={"green"}
                variant="outline"
                onClick={() => setAlert(false)}
                leftIcon={<AiOutlineStop />}
              >
                Agora Não
              </Button>
              <Button
                colorScheme={"green"}
                onClick={() => closeWindow()}
                ml={3}
                leftIcon={<AiOutlineReload />}
              >
                Reiniciar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
