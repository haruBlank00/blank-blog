package main

import (
	"bufio"
	"fmt"
	"io"
	"net"
	"strings"
)

func handleConnection(conn net.Conn) {
	defer conn.Close()

	fmt.Println("Accepted connection")

	conn.Write([]byte("2121 Welcome to my ftp server :)\n"))

	reader := bufio.NewReader(conn)
	writer := bufio.NewWriter(conn)

	var username string

	for {
		cmd, err := reader.ReadString('\n')
		if err != nil {
			if err == io.EOF {
				fmt.Println("Connection closed by the client")
				return
			}
			fmt.Println("Error reading command:", err)
			return
		}

		cmd = strings.TrimSpace(cmd)
		fmt.Println("Received cmd: ", cmd)

		args := strings.Fields(cmd)
		fmt.Println("Args", args)
		if len(args) == 0 {
			continue
		}

		command := strings.ToUpper(args[0])
		fmt.Println("Command", command)

		switch command {
		case "USER":
			if len(args) < 2 {
				writer.WriteString("501 Syntax error in parameters or arguments\r\n")
			} else {
				username = args[1]
				fmt.Println("username", username)
				writer.WriteString("331 User name okay, need password\r\n")

			}
		case "PASS":
			fmt.Println("usrename from pass case", username)
			if username == "" {
				writer.WriteString("503 Bad sequence of commands\r\n")
			} else {
				// check username and pw here
				writer.WriteString("230 User logged in\r\n")
			}
		case "LIST":
			files := []string{"file1.txt", "file2.txt", "directory/"}
			sendFileList(conn, files)
		case "QUIT":
			writer.WriteString("221 Goodbye\r\n")
			return
		default:
			writer.WriteString("502 Command not implemented\r\n")
		}
		writer.Flush()

	}
}

func sendFileList(conn net.Conn, files []string) {
	// Open a new data connection
	dataConn, err := net.Dial("tcp", "127.0.0.1:30000") // Adjust the address and port
	if err != nil {
		fmt.Println("Error opening data connection:", err)
		return
	}
	defer dataConn.Close()

	// Send the list of files over the data connection
	for _, file := range files {
		dataConn.Write([]byte(file + "\r\n"))
	}

	// Notify the client that the transfer is complete
	conn.Write([]byte("226 Transfer complete\r\n"))
}

func main() {
	port := 2121
	listener, err := net.Listen("tcp", fmt.Sprintf(":%d", port))

	if err != nil {
		fmt.Println("Error starting server: ", err)
		return
	}

	defer listener.Close()

	fmt.Printf("FTP server has started on port :%d\n", port)

	for {
		conn, err := listener.Accept()
		if err != nil {
			fmt.Println("Error accepting connection: ", err)
			continue
		}

		go handleConnection(conn)
	}
}
