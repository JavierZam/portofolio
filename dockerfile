# Menggunakan nginx:alpine sebagai base image
FROM nginx:alpine

# Menghapus default nginx landing page
RUN rm -rf /usr/share/nginx/html/*

# Menyalin file dan folder dari direktori saat ini ke direktori default nginx
COPY . /usr/share/nginx/html

# Menyalin file konfigurasi nginx yang baru
COPY default.conf /etc/nginx/conf.d/default.conf

# Menjalankan nginx di foreground
CMD ["nginx", "-g", "daemon off;"]
