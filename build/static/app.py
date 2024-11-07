from flask import Flask, request, jsonify, send_file, abort
from flask_cors import CORS  # Para habilitar CORS
from azure.storage.blob import BlobServiceClient, ContentSettings
import os
import io
from dotenv import load_dotenv  # Asegúrate de importar dotenv para cargar las variables de entorno

# Cargar las variables de entorno desde un archivo .env
load_dotenv()  # Esta línea carga las variables de entorno desde .env

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://auritasal.com"}})

# Configura la conexión a Azure Blob Storage usando una variable de entorno
AZURE_STORAGE_CONNECTION_STRING = os.getenv('AZURE_STORAGE_CONNECTION_STRING')
if not AZURE_STORAGE_CONNECTION_STRING:
    raise ValueError("Falta la variable de entorno AZURE_STORAGE_CONNECTION_STRING")

blob_service_client = BlobServiceClient.from_connection_string(AZURE_STORAGE_CONNECTION_STRING)
container_name = "testingconnextion"

# Crear un documento (Upload)
@app.route('/store', methods=['POST'])
def store_document():
    try:
        document = request.files['document']
        doc_id = request.form['doc_id']
        folder_name = request.form['folder_name']

        blob_name = f"{folder_name}/{doc_id}{os.path.splitext(document.filename)[1]}"
        blob_client = blob_service_client.get_blob_client(container=container_name, blob=blob_name)

        # Subir el documento a Azure Blob Storage
        blob_client.upload_blob(document, overwrite=True, content_settings=ContentSettings(content_type=document.content_type))

        return jsonify({'message': 'Documento almacenado con éxito', 'doc_id': doc_id, 'filename': blob_name, 'folder': folder_name})
    except Exception as e:
        app.logger.error(f"Error al almacenar el documento: {str(e)}")
        return jsonify({'error': 'Error al almacenar el documento'}), 500

# Leer un documento (Download)
@app.route('/document/<path:folder_name>/<doc_id>', methods=['GET'])
def get_document(folder_name, doc_id):
    try:
        blob_prefix = f"{folder_name}/{doc_id}"
        container_client = blob_service_client.get_container_client(container_name)

        # Buscar el blob que comienza con el doc_id
        blob_list = container_client.list_blobs(name_starts_with=blob_prefix)
        blob_client = None
        for blob in blob_list:
            blob_client = blob_service_client.get_blob_client(container=container_name, blob=blob.name)
            break

        if blob_client is None:
            abort(404, description="Documento no encontrado")

        # Descargar el blob como un archivo
        download_stream = blob_client.download_blob()
        return send_file(io.BytesIO(download_stream.readall()), as_attachment=True, attachment_filename=blob.name.split('/')[-1])
    except Exception as e:
        app.logger.error(f"Error al obtener el documento: {str(e)}")
        return jsonify({'error': 'Error al obtener el documento'}), 500

# Actualizar un documento (Upload nuevo archivo)
@app.route('/document/<path:folder_name>/<doc_id>', methods=['PUT'])
def update_document(folder_name, doc_id):
    try:
        document = request.files['document']

        blob_name = f"{folder_name}/{doc_id}{os.path.splitext(document.filename)[1]}"
        blob_client = blob_service_client.get_blob_client(container=container_name, blob=blob_name)

        # Sobrescribir el archivo existente en Azure Blob Storage
        blob_client.upload_blob(document, overwrite=True, content_settings=ContentSettings(content_type=document.content_type))
        
        return jsonify({'message': 'Documento actualizado con éxito', 'doc_id': doc_id, 'filename': blob_name, 'folder': folder_name})
    except Exception as e:
        app.logger.error(f"Error al actualizar el documento: {str(e)}")
        return jsonify({'error': 'Error al actualizar el documento'}), 500

# Listar carpetas y archivos
@app.route('/list', methods=['GET'])
def list_files():
    try:
        container_client = blob_service_client.get_container_client(container_name)
        file_structure = {}

        # Listar todos los blobs en el contenedor
        blob_list = container_client.list_blobs()
        for blob in blob_list:
            # Divide el nombre del blob para construir la estructura de carpetas
            parts = blob.name.split('/')
            current_level = file_structure
            for part in parts[:-1]:  # Excluir el nombre del archivo en sí
                if part not in current_level:
                    current_level[part] = {}
                current_level = current_level[part]
            current_level['files'] = current_level.get('files', []) + [parts[-1]]

        return jsonify(file_structure)
    except Exception as e:
        app.logger.error(f"Error al listar los archivos: {str(e)}")
        return jsonify({'error': 'Error al listar los archivos'}), 500

@app.route('/lista', methods=['GET'])
def list_files():
    try:
        
        return "Hola mundo"
    except Exception as e:
        app.logger.error(f"Error al listar los archivos: {str(e)}")
        return jsonify({'error': 'Error al listar los archivos'}), 500

# Eliminar un documento
@app.route('/document/<path:folder_name>/<doc_id>', methods=['DELETE'])
def delete_document(folder_name, doc_id):
    try:
        blob_prefix = f"{folder_name}/{doc_id}"
        container_client = blob_service_client.get_container_client(container_name)

        # Buscar y eliminar el blob que comienza con el doc_id
        blob_list = container_client.list_blobs(name_starts_with=blob_prefix)
        for blob in blob_list:
            blob_client = blob_service_client.get_blob_client(container=container_name, blob=blob.name)
            blob_client.delete_blob()
            return jsonify({'message': 'Documento eliminado con éxito', 'doc_id': doc_id, 'folder': folder_name})
        
        abort(404, description="Documento no encontrado")
    except Exception as e:
        app.logger.error(f"Error al eliminar el documento: {str(e)}")
        return jsonify({'error': 'Error al eliminar el documento'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
