cat > /tmp/import-keys.sh << 'EOF'
#!/bin/bash
set -e

# Создаем структуру каталогов
mkdir -p /etc/portage/gnupg
chown portage:portage /etc/portage/gnupg
chmod 700 /etc/portage/gnupg

# Импортируем каждый ключ
while read fp; do
  [ -z "$fp" ] && continue  # Пропускаем пустые строки
  
  echo "Обработка ключа: $fp"
  sudo -u portage gpg --homedir /etc/portage/gnupg \
    --keyserver hkps://keys.gentoo.org \
    --recv-keys "$fp"
    
  echo -e "trust\n5\ny\n" | sudo -u portage gpg \
    --homedir /etc/portage/gnupg \
    --command-fd 0 \
    --edit-key "$fp"
done < /tmp/my-gpg-keys.txt

# Создаем seed-файл
sudo -u portage dd if=/dev/urandom of=/etc/portage/gnupg/random_seed bs=1024 count=1
chmod 600 /etc/portage/gnupg/random_seed
EOF
chmod +x /tmp/import-keys.sh
cat /tmp/import-keys.sh | bash
