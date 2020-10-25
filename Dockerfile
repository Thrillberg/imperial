FROM golang:latest
COPY /server /server
WORKDIR /server
RUN GOOS=linux GOARCH=amd64 go build -o Imperial
EXPOSE 80
CMD /server/Imperial
