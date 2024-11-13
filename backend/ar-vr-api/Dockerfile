# Dokerfile is partly AI GENERATED
# Use official Gradle image for building the project
FROM gradle:8.10-jdk17 AS build

# Set the working directory
WORKDIR /app

# Copy the entire project into the container
COPY . .

# Build the Kotlin project
RUN ./gradlew build --no-daemon --exclude-task test

# Use a lightweight Java runtime for running the app
FROM amazoncorretto:17-alpine-jdk

# Copy the built JAR file from the build stage
COPY --from=build /app/build/libs/*.jar /app/app.jar
EXPOSE 8080

# Set the command to run the app
CMD ["java", "-jar", "/app/app.jar"]