from fastapi import FastAPI,Query,status,HTTPException,Depends,File,UploadFile,Form
from fastapi.middleware.cors import CORSMiddleware
import os
from datetime import datetime
from fastapi.responses import JSONResponse

from segment import list_checkpoint_files, run_segmentation, run_extraction
from fastapi.staticfiles import StaticFiles

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

os.makedirs("images", exist_ok=True)
app.mount("/images", StaticFiles(directory="images"), name="images")

async def get_prediction_results(uploaded_files, checkpoint_path='checkpoints/molnextr_best.pth'):
    return prediction.predict_from_image_files(uploaded_files, checkpoint_path)

@app.get("/")
async def read_root():
    # files = run_segmentation('test_pages_1-4.pdf', output_dir='output')
    return JSONResponse(content={
        "message": "Hello, World!",
        "files": "files"
    })
    #return {"message": "Hello, World!", "files": files}
    
@app.post("/upload-and-get-chemical-images",status_code=status.HTTP_200_OK)
async def upload_and_run_segmentation(
    file: UploadFile = File(...),
    startPage: int = Form(1),
    endPage: int = Form(1)
):
    uploaded_file = []
    # return {"message": "There was an error uploading the file", "startPage": startPage, "endPage": endPage}
    try:
        contents = await file.read()
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        filename, ext = os.path.splitext(file.filename)
        new_filename = f"{filename}_{timestamp}{ext}"
        upload_dir = os.path.join(os.path.dirname(__file__), "uploads")
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, new_filename)
        with open(file_path, "wb") as f:
            f.write(contents)
        uploaded_file.append(file_path)
        
        # Run extraction on this file with startPage and endPage
        try:
            trimmed_pdf_path = await run_extraction(file_path, startPage=startPage, endPage=endPage)
        except Exception as e:
            return {"message": f"There was an error during extraction: {str(e)}"}
        
        # Run segmentation on this file with startPage and endPage
        try:
            files = run_segmentation(str(trimmed_pdf_path), output_dir='images')
        except Exception as e:
            return {"message": f"There was an error during segmentation: {str(e)}"}

        try:
            checkpoints = list_checkpoint_files()
        except Exception as e:
            return {"message": f"There was an error listing checkpoint files: {str(e)}"}

        # return files
        return JSONResponse(content={
            "images": files,
            "checkpoints": checkpoints
        })
    except Exception as e:
        return {"message": f"There was an error uploading the file: {str(e)}"}
    finally:
        await file.close()

@app.post("/prediction",status_code=status.HTTP_200_OK)
async def run_prediction(file: UploadFile = File(...)):
    uploaded_file = []
    try:
        contents = await file.read()
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        filename, ext = os.path.splitext(file.filename)
        new_filename = f"{filename}_{timestamp}{ext}"
        upload_dir = os.path.join(os.path.dirname(__file__), "uploads")
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, new_filename)
        with open(file_path, "wb") as f:
            f.write(contents)
        uploaded_file.append(file_path)
    except Exception:
        return {"message": "There was an error uploading the file"}
    finally:
        await file.close()
    
    # now we need to call the predition function from ML_model
    results = await get_prediction_results(uploaded_file, checkpoint_path='checkpoints/molnextr_best.pth')
    return JSONResponse(content={
        "filename": new_filename,
        "file_paths": uploaded_file,
        "message": "File uploaded successfully",
        "results": results
    })
    
@app.post("/predictions",status_code=status.HTTP_200_OK)
async def run_predictions(files: list[UploadFile]=File(...)):
    uploaded_files = []
    for file in files:
        try:
            contents = await file.read()
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            filename, ext = os.path.splitext(file.filename)
            new_filename = f"{filename}_{timestamp}{ext}"
            upload_dir = os.path.join(os.path.dirname(__file__), "uploads")
            os.makedirs(upload_dir, exist_ok=True)
            file_path = os.path.join(upload_dir, new_filename)
            with open(file_path, "wb") as f:
                f.write(contents)
            uploaded_files.append(file_path)
        except Exception:
            return {"message": "There was an error uploading the file"}
        finally:
            await file.close()

    # now we need to call the predition function from ML_model
    results = await get_prediction_results(uploaded_files, checkpoint_path='checkpoints/molnextr_best.pth')
    return JSONResponse(content={
        "file_paths": uploaded_files,
        "message": "Files uploaded successfully",
        "results": results
    })

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
async def create_upload_files(filess: list[UploadFile]=File(...)):
    return {"filename": [file.filename for file in filess],"filesize":[len(file.file.read()) for file in filess]}