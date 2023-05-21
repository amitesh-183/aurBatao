import { HStack, Heading, VStack, Avatar, Text } from "@chakra-ui/react";

export default function Message({ text, uri, user = "other" }) {
  let datetime = new Date().toLocaleTimeString("en-US", {
    hour12: true,
    hour: "numeric",
    minute: "numeric",
  });
  return (
    <HStack
      alignSelf={user === "me" ? "flex-end" : "flex-start"}
      flexDirection={user === "me" ? "" : "row-reverse"}
      px={4}
    >
      <VStack marginTop={8}>
        <Heading
          size={2}
          alignSelf={user === "me" ? "self-end" : "self-start"}
          pl={2}
        >
          {user}
          <span style={{ color: "gray", fontSize: "10px", marginLeft: "6px" }}>
            {datetime.toLowerCase()}
          </span>
        </Heading>
        <Text
          borderRightRadius={user === "me" ? "full" : ""}
          borderLeftRadius={user === "me" ? "full" : ""}
          borderBottomLeftRadius={"full"}
          borderBottomRightRadius={"full"}
          borderTopRightRadius={user === "me" ? "" : "full"}
          py={2}
          px={4}
          bg={"gray.100"}
          mx={2}
        >
          {text}
        </Text>
      </VStack>
      <Avatar size="sm" name={text} src={uri} />
    </HStack>
  );
}
