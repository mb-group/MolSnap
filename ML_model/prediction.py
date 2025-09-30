import torch 
from .MolNexTR import molnextr

def predict_from_image_files(image_files: list, 
                            model_path: str, 
                            device: str = None
                            ):
    """
    Predicts SMILES and molecular structure from a list of image file paths using a pre-trained MolNexTR model.
    
    Args:
        image_files (list): List of paths to the input image files.
        model_path (str): Path to the pre-trained model file.
        device (str): Device to run the model on ('cpu' or 'cuda').
        return_atoms_bonds (bool): Whether to return atom and bond information.
        
    Return:
        result (list): List of predictions result for the image file, with keys 'predicted_smiles', 'predicted_molfile', 'atom_sets', 'bond_sets'.

    """

    if device is None:
        device = 'cuda' if torch.cuda.is_available() else 'cpu'

    model = molnextr(model_path=model_path, device=device)
    result = model.predict_image_files(image_files, return_atoms_bonds=True, return_confidence=True)
    
    return result
