FROM ubuntu:18.04
RUN make server/build
COPY /server/Imperial /server/Imperial
EXPOSE 80
CMD /server/Imperial
