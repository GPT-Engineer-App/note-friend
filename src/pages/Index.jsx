import { useState } from "react";
import { Container, VStack, HStack, Textarea, Button, Text, Box, IconButton, Table, Thead, Tbody, Tr, Th, Td, Checkbox, useToast } from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";

const Index = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const toast = useToast();
  const [inputValue, setInputValue] = useState("");

  const addNote = () => {
    if (inputValue.trim() !== "") {
      setNotes([...notes, inputValue]);
      setInputValue("");
    }
  };

  const deleteNote = (index) => {
    const newNotes = notes.filter((_, i) => i !== index);
    setNotes(newNotes);
  };

  const saveNote = (index) => {
    const newNotes = [...notes];
    newNotes[index] = editValue;
    setNotes(newNotes);
    setEditIndex(null);
    setEditValue("");
  };

  const handleSelectNote = (index) => {
    setSelectedNotes((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const deleteSelectedNotes = () => {
    setNotes(notes.filter((_, index) => !selectedNotes.includes(index)));
    setSelectedNotes([]);
    toast({
      title: "Notes deleted.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const exportSelectedNotes = () => {
    const selected = notes.filter((_, index) => selectedNotes.includes(index));
    const blob = new Blob([selected.join("\n")], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "notes.txt";
    link.click();
    toast({
      title: "Notes exported.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const exportAllNotes = () => {
    const blob = new Blob([notes.join("\n")], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "all_notes.txt";
    link.click();
    toast({
      title: "All notes exported.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4} width="100%">
        <HStack width="100%">
          <Textarea placeholder="Enter your note" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
          <Button onClick={addNote} colorScheme="teal">
            Add Note
          </Button>
        </HStack>
        <HStack width="100%" justifyContent="flex-end">
          <Button onClick={deleteSelectedNotes} colorScheme="red" isDisabled={selectedNotes.length === 0}>
            Delete Selected
          </Button>
          <Button onClick={exportSelectedNotes} colorScheme="blue" isDisabled={selectedNotes.length === 0}>
            Export Selected
          </Button>
          <Button onClick={exportAllNotes} colorScheme="purple">
            Export All
          </Button>
        </HStack>
        <Table variant="simple" width="100%">
          <Thead>
            <Tr>
              <Th>Select</Th>
              <Th>Note</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {notes.map((note, index) => (
              <Tr key={index}>
                <Td>
                  <Checkbox isChecked={selectedNotes.includes(index)} onChange={() => handleSelectNote(index)} />
                </Td>
                <Td>{editIndex === index ? <Textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} /> : note}</Td>
                <Td>
                  {editIndex === index ? (
                    <Button onClick={() => saveNote(index)} colorScheme="green">
                      Save
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setEditIndex(index);
                        setEditValue(note);
                      }}
                      colorScheme="yellow"
                    >
                      Edit
                    </Button>
                  )}
                  <IconButton aria-label="Delete note" icon={<FaTrash />} onClick={() => deleteNote(index)} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>
    </Container>
  );
};

export default Index;
