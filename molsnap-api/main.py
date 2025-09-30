from fastapi import FastAPI,Query,status,HTTPException,Depends,File,UploadFile,Form
from fastapi.middleware.cors import CORSMiddleware
import os
from datetime import datetime

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}

# @app.post("/uploadfile",status_code=status.HTTP_200_OK)
# async def create_upload_file(file: UploadFile=File(...)):
#     return {"filename": file.filename,"filesize":len(file.file.read())}

# for Individual files
@app.post("/uploadfile", status_code=status.HTTP_200_OK)
async def create_upload_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        filename, ext = os.path.splitext(file.filename)
        new_filename = f"{filename}_{timestamp}{ext}"
        os.makedirs("uploads", exist_ok=True)
        with open(f"uploads/{new_filename}", "wb") as f:
            f.write(contents)
    except Exception:
        return {"message": "There was an error uploading the file"}
    finally:
        await file.close()
    return {"filename": new_filename, "message": "File uploaded successfully"}

# for multiple files
@app.post("/uploadfiles",status_code=status.HTTP_200_OK)
async def create_upload_files(files: list[UploadFile]=File(...)):
    return {"filename": [file.filename for file in files],"filesize":[len(file.file.read()) for file in files]}