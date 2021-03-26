import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { FaCheck, FaLock, FaSearch, FaUserAlt } from "react-icons/fa";
import MaskedInput from "react-text-mask";

export default function Raffles() {
  const [search, setSearch] = useState("all");
  const [text, setText] = useState("");
  const [cpf, setCpf] = useState("");

  const [modal, setModal] = useState(false);
  const [justification, setJustification] = useState("");

  return (
    <>
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
          <Button isFullWidth leftIcon={<FaSearch />} colorScheme="purple">
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
      </HStack>

      <Box rounded="lg" p={5} borderWidth="1px" mt={5}>
        <Grid
          templateColumns="repeat(auto-fit, minmax(220px, 220px))"
          gap="30px"
          justifyContent="center"
        >
          <Box w="220px">
            <LinkBox
              rounded="lg"
              overflow="hidden"
              w="220px"
              bg="white"
              shadow="lg"
              borderWidth="5px"
              borderColor="orange.400"
            >
              <Box w="220px" h="220px">
                <Image
                  src="https://image.freepik.com/vetores-gratis/composicao-de-loteria-isometrica-com-dinheiro-vencedor-moedas-carro-jackpot-inscricao-rifa-instantanea-tambor-tv-bolas-loto-isoladas_1284-39090.jpg"
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
                  Título da Rifa Título da Rifa Título da Rifa
                </Heading>

                <Text fontSize="xs" mt={2}>
                  Sorteio dia <strong>10/10/1010</strong> as{" "}
                  <strong>19:00</strong>
                </Text>
                <Flex align="center" mt={1}>
                  <Text fontWeight="300" mr={2}>
                    R$
                  </Text>
                  <Text fontWeight="800">1000</Text>
                </Flex>
                <Divider mt={1} mb={1} />
                <Flex align="center" fontSize="xs">
                  <Icon as={FaUserAlt} mr={2} />
                  <Text w="180px" isTruncated noOfLines={1}>
                    Nome do usuário
                  </Text>
                </Flex>
              </Box>
            </LinkBox>
            <Grid templateColumns="1fr 1fr" gap="10px" mt={2}>
              <Button
                size="sm"
                shadow="md"
                colorScheme="green"
                leftIcon={<FaCheck />}
              >
                Liberar
              </Button>
              <Button
                size="sm"
                shadow="md"
                colorScheme="red"
                leftIcon={<FaLock />}
              >
                Recusar
              </Button>
            </Grid>
          </Box>

          <Box w="220px">
            <LinkBox
              rounded="lg"
              overflow="hidden"
              w="220px"
              bg="white"
              shadow="lg"
              borderWidth="5px"
              borderColor="green.400"
            >
              <Box w="220px" h="220px">
                <Image
                  src="https://image.freepik.com/vetores-gratis/composicao-de-loteria-isometrica-com-dinheiro-vencedor-moedas-carro-jackpot-inscricao-rifa-instantanea-tambor-tv-bolas-loto-isoladas_1284-39090.jpg"
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
                  Título da Rifa Título da Rifa Título da Rifa
                </Heading>

                <Text fontSize="xs" mt={2}>
                  Sorteio dia <strong>10/10/1010</strong> as{" "}
                  <strong>19:00</strong>
                </Text>
                <Flex align="center" mt={1}>
                  <Text fontWeight="300" mr={2}>
                    R$
                  </Text>
                  <Text fontWeight="800">1000</Text>
                </Flex>
                <Divider mt={1} mb={1} />
                <Flex align="center" fontSize="xs">
                  <Icon as={FaUserAlt} mr={2} />
                  <Text w="180px" isTruncated noOfLines={1}>
                    Nome do usuário
                  </Text>
                </Flex>
              </Box>
            </LinkBox>
            <Grid templateColumns="1fr" gap="10px" mt={2}>
              <Button
                size="sm"
                shadow="md"
                colorScheme="red"
                leftIcon={<FaLock />}
                onClick={() => setModal(true)}
              >
                Bloquear
              </Button>
            </Grid>
          </Box>

          <Box w="220px">
            <LinkBox
              rounded="lg"
              overflow="hidden"
              w="220px"
              bg="white"
              shadow="lg"
              borderWidth="5px"
              borderColor="red.600"
            >
              <Box w="220px" h="220px">
                <Image
                  src="https://image.freepik.com/vetores-gratis/composicao-de-loteria-isometrica-com-dinheiro-vencedor-moedas-carro-jackpot-inscricao-rifa-instantanea-tambor-tv-bolas-loto-isoladas_1284-39090.jpg"
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
                  Título da Rifa Título da Rifa Título da Rifa
                </Heading>

                <Text fontSize="xs" mt={2}>
                  Sorteio dia <strong>10/10/1010</strong> as{" "}
                  <strong>19:00</strong>
                </Text>
                <Flex align="center" mt={1}>
                  <Text fontWeight="300" mr={2}>
                    R$
                  </Text>
                  <Text fontWeight="800">1000</Text>
                </Flex>
                <Divider mt={1} mb={1} />
                <Flex align="center" fontSize="xs">
                  <Icon as={FaUserAlt} mr={2} />
                  <Text w="180px" isTruncated noOfLines={1}>
                    Nome do usuário
                  </Text>
                </Flex>
              </Box>
            </LinkBox>
            <Grid templateColumns="1fr" gap="10px" mt={2}>
              <Button
                size="sm"
                shadow="md"
                colorScheme="green"
                leftIcon={<FaCheck />}
              >
                Liberar
              </Button>
            </Grid>
          </Box>
        </Grid>
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
    </>
  );
}
