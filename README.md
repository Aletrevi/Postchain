# Postchain

# Events:
- Post creato
    - isChecked = false
    - isPublished = false 
    - status = pending
    - verifica in checker
    - pubblicazione in blockchain
- Post eliminato (IGNORA)
    - rimozione dalla blockchain
- Verifica checker ok
    - post microservice approva in db -> isChecked = true
- Verifica checker fallita
    - post microservice -> status = rejected / isChecked = true
- Salvataggio in blockchain fallito
    - post microservice -> status = rejected / isPublished = true
- Salvataggio in blockchain ok
    - post microservice -> isPublished = true
- Post non approvato/pubblicato e ripostato (post_reformed)
    - isChecked = false / isPublished = false / status = pending