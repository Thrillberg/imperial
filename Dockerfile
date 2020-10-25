FROM ubuntu:18.04
COPY /server/Imperial /server/Imperial
EXPOSE 80
CMD /server/Imperial
