import { useEffect, useRef, useState } from "react";
import "./App.css";
import {
  Box,
  Container,
  HStack,
  Input,
  Button,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { app } from "./firebase";
import Message from "./components/Message";
import {
  onAuthStateChanged,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  serverTimestamp,
  onSnapshot,
  addDoc,
  orderBy,
  query,
} from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);

const loginHandler = () => {
  signInWithPopup(auth, new GoogleAuthProvider());
};

const logoutHandler = () => signOut(auth);

function App() {
  const [user, setUser] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const divForScroll = useRef(null);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setMessage("");

      await addDoc(collection(db, "Messages"), {
        text: message,
        uid: user.uid,
        uri: user.photoURL,
        createdAt: serverTimestamp(),
      });

      divForScroll.current.scrollIntoView({
        behavior: "smooth",
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "Messages"), orderBy("createdAt", "asc"));

    const unsubscribe = onAuthStateChanged(auth, (data) => {
      setUser(data);
    });

    const unsubscribeForMessage = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((item) => {
          const id = item.id;
          return { id, ...item.data() };
        })
      );
    });

    return () => {
      unsubscribe();
      unsubscribeForMessage();
    };
  }, []);

  return (
    <>
      <Box bg={"red.50"}>
        {user ? (
          <Container bg="white" h="100vh">
            <VStack h={"full"}>
              <HStack
                w={"full"}
                justifyContent={"space-between"}
                px={4}
                py={4}
                rounded={"xs"}
                borderBottom={"2px"}
                borderColor={"gray.200"}
              >
                <Heading
                  style={{
                    color: "#7b88db",
                    backgroundImage:
                      "-webkitLinearGradient(0deg, #7b88db 0%, #6151aa 33%, #3d64f8 67%)",
                    backgroundClip: "text",
                    textFillColor: "transparent",
                  }}
                  size={"lg"}
                  fontFamily={"sans-serif"}
                  colorScheme=""
                >
                  AurBatao
                </Heading>
                <Button onClick={logoutHandler} colorScheme="teal">
                  Logout
                </Button>
              </HStack>
              <VStack
                h={"full"}
                w={"full"}
                overflowY={"auto"}
                css={{
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                {messages.map((item) => (
                  <Message
                    key={item.id}
                    user={item.uid === user.uid ? "me" : "anonymous"}
                    // name={user.displayName}
                    text={item.text}
                    uri={item.uri}
                  />
                ))}

                <div ref={divForScroll}></div>
              </VStack>

              <form onSubmit={submitHandler} style={{ width: "100%" }}>
                <HStack p={4}>
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    variant={"filled"}
                    placeholder="Enter a message..."
                  />
                  <Button colorScheme="purple" type="submit">
                    Send
                  </Button>
                </HStack>
              </form>
            </VStack>
          </Container>
        ) : (
          <VStack justifyContent={"center"} h={"100vh"} bg={"white"}>
            <Heading
              style={{
                color: "#7b88db",
                backgroundImage:
                  "-webkitLinearGradient(0deg, #7b88db 0%, #6151aa 33%, #3d64f8 67%)",
                backgroundClip: "text",
                textFillColor: "transparent",
              }}
              size={"2xl"}
              fontFamily={"sans-serif"}
              colorScheme=""
            >
              AurBatao
            </Heading>
            <Button colorScheme="teal" onClick={loginHandler}>
              Sign In With Google
            </Button>
          </VStack>
        )}
      </Box>
    </>
  );
}

export default App;
