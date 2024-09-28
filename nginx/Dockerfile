# Use the official Nginx image as the base image
FROM nginx:alpine

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the build output of the frontend
COPY --from=frontend /app/.next /usr/share/nginx/html

# Expose the port Nginx will run on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]