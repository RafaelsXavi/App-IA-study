
# Configurações para o processamento de texto.
# Regra geral para estimativa: 1 token ~ 4 caracteres.
# O alvo de 500-800 tokens se traduz em aproximadamente 2000-3200 caracteres.
# Escolhemos um valor conservador para garantir que os chunks se encaixem nos limites do modelo.
CHUNK_SIZE: int = 2500

# A sobreposição garante que o contexto semântico não seja perdido entre os chunks.
CHUNK_OVERLAP: int = 200

# Timeout em segundos para chamadas à API de IA. Evita que a requisição fique presa.
AI_REQUEST_TIMEOUT: int = 60
