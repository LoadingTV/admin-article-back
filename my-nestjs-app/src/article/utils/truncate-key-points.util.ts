export function truncateKeyPoints(keyPoints: string, maxLength: number): string {

    const separatorRegex = /[,;|\n\/]/; 
  
    const keyParts = keyPoints.split(separatorRegex);
  
    let truncated = '';
    for (let i = 0; i < keyParts.length; i++) {
      if (truncated.length + keyParts[i].length > maxLength) {
        truncated += '...';
        break;
      }
      if (i > 0) {
        truncated += ', ';
      }
      truncated += keyParts[i];
    }
  
    return truncated;
  }
  