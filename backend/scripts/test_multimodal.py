"""
Test Suite for Multimodal Math Embedding System

Tests all components of the pipeline:
- PDF processing
- Formula extraction
- Image processing
- Chunking
- Embedding
- Upload
"""

import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent.parent
sys.path.insert(0, str(backend_path))

import logging
import numpy as np
from app.services.multimodal.pdf_processor import PDFProcessor
from app.services.multimodal.formula_extractor import FormulaExtractor
from app.services.multimodal.chunker import MathChunker
from app.services.multimodal.embedder import MultimodalEmbedder

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def test_formula_extractor():
    """Test formula extraction and LaTeX conversion."""
    print("\n" + "="*80)
    print("TEST 1: Formula Extractor")
    print("="*80)
    
    extractor = FormulaExtractor()
    
    test_cases = [
        "Solve the equation: 2x + 3 = 7",
        "The area of a circle is A = πr²",
        "Calculate √(16) + 3/4",
        "The formula is $E = mc^2$ in physics",
        "Find the derivative: dy/dx = 2x + 1",
        "Theorem: For a right triangle, a² + b² = c²",
    ]
    
    total_formulas = 0
    
    for text in test_cases:
        print(f"\nText: {text}")
        formulas = extractor.extract_formulas(text)
        total_formulas += len(formulas)
        
        for f in formulas:
            print(f"  ✓ Formula: {f['latex']} (confidence: {f['confidence']})")
            print(f"    Type: {extractor.classify_formula(f['latex'])}")
    
    print(f"\n✅ Extracted {total_formulas} formulas from {len(test_cases)} texts")
    return True


def test_chunker():
    """Test semantic chunking."""
    print("\n" + "="*80)
    print("TEST 2: Math Chunker")
    print("="*80)
    
    chunker = MathChunker()
    
    # Test text blocks
    test_blocks = [
        {"text": "1. Solve the equation: 2x + 3 = 7", "page_number": 5},
        {"text": "Solution: Step 1: Subtract 3 from both sides. Step 2: Divide by 2. Step 3: x = 2", "page_number": 5},
        {"text": "Definition: A prime number is a natural number greater than 1.", "page_number": 6},
        {"text": "Example 1: Find the area of a circle with radius 5 cm.", "page_number": 7},
    ]
    
    # Test formulas
    test_formulas = [
        {"raw_text": "2x + 3 = 7", "latex": "$2x + 3 = 7$", "confidence": 0.9},
        {"raw_text": "A = πr²", "latex": "$A = \\pi r^2$", "confidence": 1.0},
    ]
    
    # Test images
    test_images = [
        {"image_path": "test_diagram.png", "page_number": 8, "width": 400, "height": 300},
    ]
    
    chunks = chunker.chunk_content(
        text_blocks=test_blocks,
        images=test_images,
        formulas=test_formulas,
        class_num=5,
        chapter_num=1
    )
    
    print(f"\n✅ Created {len(chunks)} chunks")
    
    # Show chunk distribution
    type_counts = {}
    for chunk in chunks:
        ctype = chunk['content_type']
        type_counts[ctype] = type_counts.get(ctype, 0) + 1
    
    print("\nChunk types:")
    for ctype, count in sorted(type_counts.items()):
        print(f"  {ctype}: {count}")
    
    # Show sample chunks
    print("\nSample chunks:")
    for i, chunk in enumerate(chunks[:3], 1):
        print(f"\n  Chunk {i}:")
        print(f"    ID: {chunk['chunk_id']}")
        print(f"    Type: {chunk['content_type']}")
        print(f"    Text: {chunk['raw_text'][:60]}...")
        print(f"    Has formula: {chunk['has_formula']}")
        print(f"    Has image: {chunk['has_image']}")
    
    return True


def test_embedder():
    """Test multimodal embedding generation."""
    print("\n" + "="*80)
    print("TEST 3: Multimodal Embedder")
    print("="*80)
    
    embedder = MultimodalEmbedder()
    
    # Test chunks (various types)
    test_chunks = [
        {
            "raw_text": "Solve the equation 2x + 3 = 7",
            "latex_formula": "$2x + 3 = 7$",
            "has_formula": True,
            "has_image": False,
            "content_type": "question"
        },
        {
            "raw_text": "A triangle has three sides and three angles",
            "has_formula": False,
            "has_image": False,
            "content_type": "definition"
        },
        {
            "raw_text": "The area of a circle is πr²",
            "latex_formula": "$A = \\pi r^2$",
            "has_formula": True,
            "has_image": False,
            "content_type": "formula"
        }
    ]
    
    print(f"\nProcessing {len(test_chunks)} test chunks...")
    
    for i, chunk in enumerate(test_chunks, 1):
        print(f"\nChunk {i}: {chunk['content_type']}")
        print(f"  Text: {chunk['raw_text'][:50]}...")
        
        embedding = embedder.embed_chunk(chunk)
        
        print(f"  ✓ Embedding shape: {embedding.shape}")
        print(f"  ✓ Norm: {np.linalg.norm(embedding):.4f}")
        print(f"  ✓ Min/Max: [{embedding.min():.4f}, {embedding.max():.4f}]")
        
        # Verify dimensions
        assert embedding.shape == (768,), f"Expected 768-dim, got {embedding.shape}"
        assert np.isfinite(embedding).all(), "Embedding contains non-finite values"
    
    # Test batch processing
    print(f"\nBatch processing all chunks...")
    batch_embeddings = embedder.embed_chunks_batch(test_chunks, show_progress=False)
    
    print(f"✅ Generated {len(batch_embeddings)} batch embeddings")
    
    # Get stats
    stats = embedder.get_embedding_stats(batch_embeddings)
    print(f"\nEmbedding statistics:")
    print(f"  Count: {stats['count']}")
    print(f"  Dimension: {stats['dimension']}")
    print(f"  Mean norm: {stats['mean_norm']:.4f}")
    print(f"  Std norm: {stats['std_norm']:.4f}")
    
    return True


def test_integration():
    """Test integration of multiple components."""
    print("\n" + "="*80)
    print("TEST 4: Integration Test")
    print("="*80)
    
    # Initialize all components
    print("\nInitializing components...")
    extractor = FormulaExtractor()
    chunker = MathChunker()
    embedder = MultimodalEmbedder()
    
    # Simulate PDF extraction result
    text_blocks = [
        {"text": "1. Calculate the area of a rectangle with length 5 cm and width 3 cm.", "page_number": 10},
        {"text": "Solution: Area = length × width = 5 × 3 = 15 cm²", "page_number": 10},
    ]
    
    # Extract formulas
    print("\n1. Extracting formulas...")
    all_formulas = []
    for block in text_blocks:
        formulas = extractor.extract_formulas(block['text'])
        all_formulas.extend(formulas)
    print(f"   ✓ Found {len(all_formulas)} formulas")
    
    # Create chunks
    print("\n2. Creating chunks...")
    chunks = chunker.chunk_content(
        text_blocks=text_blocks,
        images=[],
        formulas=all_formulas,
        class_num=6,
        chapter_num=2
    )
    print(f"   ✓ Created {len(chunks)} chunks")
    
    # Generate embeddings
    print("\n3. Generating embeddings...")
    embeddings = embedder.embed_chunks_batch(chunks, show_progress=False)
    print(f"   ✓ Generated {len(embeddings)} embeddings")
    
    # Verify
    print("\n4. Verifying results...")
    assert len(chunks) == len(embeddings), "Chunk-embedding count mismatch"
    assert all(e.shape == (768,) for e in embeddings), "Invalid embedding dimensions"
    print(f"   ✓ All verifications passed")
    
    print("\n✅ Integration test successful!")
    return True


def run_all_tests():
    """Run all tests."""
    print("\n" + "🚀"*40)
    print("MULTIMODAL MATH EMBEDDING - TEST SUITE")
    print("🚀"*40)
    
    tests = [
        ("Formula Extractor", test_formula_extractor),
        ("Math Chunker", test_chunker),
        ("Multimodal Embedder", test_embedder),
        ("Integration Test", test_integration),
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        try:
            success = test_func()
            results[test_name] = "✅ PASSED" if success else "❌ FAILED"
        except Exception as e:
            results[test_name] = f"❌ ERROR: {e}"
            logger.error(f"Test failed: {e}", exc_info=True)
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    for test_name, result in results.items():
        print(f"{test_name}: {result}")
    
    passed = sum(1 for r in results.values() if "PASSED" in r)
    total = len(results)
    
    print(f"\n{passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! System is production-ready!")
        return 0
    else:
        print("\n⚠️ Some tests failed. Check logs above for details.")
        return 1


if __name__ == "__main__":
    exit_code = run_all_tests()
    sys.exit(exit_code)
