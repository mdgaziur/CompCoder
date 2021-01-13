import React from "react";
import { Box, Flex, Image, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      mb={8}
      p={8}
      bg={["primary.500", "primary.500", "transparent", "transparent"]}
      color={["white", "white", "primary.700", "primary.700"]}
    >
      <Flex align="center">
        <Image
          src={process.env.PUBLIC_URL + "media/CompCoder Black Background.png"}
          height="50px"
        ></Image>
      </Flex>
      <Box>
        <Button>
          <Link to="/problems">Problems</Link>
        </Button>
      </Box>
    </Flex>
  );
}
