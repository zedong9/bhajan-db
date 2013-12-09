# Taken from http://ejohn.org/blog/keeping-passwords-in-source-control/

.PHONY: _pwd_prompt decrypt_conf encrypt_conf

CONF_FILE=models/db-credentials.json

# 'private' task for echoing instructions
_pwd_prompt:
	@echo "Contact sai.gunturi@gmail.com for the password."

# to create conf/settings.json
decrypt_creds: _pwd_prompt
	openssl cast5-cbc -d -in ${CONF_FILE}.cast5 -out ${CONF_FILE}
	chmod 600 ${CONF_FILE}

# for updating conf/settings.json
encrypt_creds: _pwd_prompt
	openssl cast5-cbc -e -in ${CONF_FILE} -out ${CONF_FILE}.cast5
