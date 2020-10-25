FROM ubuntu:18.04
RUN cd server && make build
COPY /server/Imperial /server/Imperial
EXPOSE 80
CMD /server/Imperial
