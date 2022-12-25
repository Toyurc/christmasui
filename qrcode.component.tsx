import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
  link: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ link }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  useEffect(() => {
    QRCode.toDataURL(link)
      .then((url) => {
        setQrCodeUrl(url);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [link]);

  return (
    <>
      {qrCodeUrl && (
        <a href={qrCodeUrl} download="qr-code.png">
          <img src={qrCodeUrl} alt="QR code" />
          <p>Download</p>
        </a>
      )}
    </>
  );
};

export default QRCodeGenerator;
