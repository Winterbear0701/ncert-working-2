"""
Multimodal Embedding & Retrieval System for NCERT Mathematics

A production-grade pipeline for processing mathematical content with:
- Text embeddings (theory, questions, solutions)
- Formula extraction & LaTeX embeddings
- Image embeddings (diagrams, graphs, figures)
- Intelligent semantic chunking
- Pinecone storage with rich metadata
- Multimodal query retrieval

Architecture:
    PDF → Processor → Chunker → Embedder → Pinecone
         ↓           ↓          ↓
    Text+Images  Formulas   768-dim vectors
"""

from .pdf_processor import PDFProcessor
from .formula_extractor import FormulaExtractor
from .image_processor import ImageProcessor
from .chunker import MathChunker
from .embedder import MultimodalEmbedder
from .uploader import PineconeUploader

__all__ = [
    'PDFProcessor',
    'FormulaExtractor',
    'ImageProcessor',
    'MathChunker',
    'MultimodalEmbedder',
    'PineconeUploader'
]

__version__ = '1.0.0'
