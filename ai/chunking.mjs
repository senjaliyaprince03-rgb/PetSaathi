/**
 * Document Chunking
 * Splits text into optimal segments for embedding while preserving metadata.
 */

export function chunkText(document, options = {}) {
  const {
    text,
    metadata = {}
  } = document;
  
  const {
    chunkSize = 1000,
    overlap = 200
  } = options;

  if (!text) return [];

  const chunks = [];
  
  // Basic sentence-aware chunker
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  let currentChunkText = "";
  let chunkIndex = 0;

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i].trim();
    
    if (currentChunkText.length + sentence.length > chunkSize && currentChunkText.length > 0) {
      // Save current chunk
      chunks.push({
        id: `${metadata.documentId || 'doc'}-chunk-${chunkIndex}`,
        text: currentChunkText.trim(),
        metadata: {
          ...metadata,
          chunkIndex
        }
      });
      chunkIndex++;
      
      // Calculate overlap by walking backwards through sentences
      let overlapText = "";
      let j = i - 1;
      while (j >= 0 && overlapText.length + sentences[j].length <= overlap) {
        overlapText = sentences[j].trim() + " " + overlapText;
        j--;
      }
      
      currentChunkText = overlapText + sentence + " ";
    } else {
      currentChunkText += sentence + " ";
    }
  }

  // Save remaining chunk
  if (currentChunkText.trim().length > 0) {
    chunks.push({
      id: `${metadata.documentId || 'doc'}-chunk-${chunkIndex}`,
      text: currentChunkText.trim(),
      metadata: {
        ...metadata,
        chunkIndex
      }
    });
  }

  return chunks;
}
