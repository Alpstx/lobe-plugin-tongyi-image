'use client';

import { useState } from 'react';
import { lobeChat } from '@lobehub/chat-plugin-sdk/client';
import Image from 'next/image';

export default function Home() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async (prompt: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      const data = await response.json()
      setImageUrl(data.imageUrl)
      lobeChat.setPluginMessage(`Image generated: ${data.imageUrl}`)
    } catch (error) {
      console.error('Error generating image:', error)
      lobeChat.setPluginMessage('Failed to generate image')
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      {loading ? (
        <p>Generating image...</p>
      ) : imageUrl ? (
        <Image src={imageUrl} alt="Generated image" className="max-w-xl" />
      ) : (
        <p>No image generated yet</p>
      )}
    </div>
  )
}