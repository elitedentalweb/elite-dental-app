import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { fileName, fileType } = await req.json();

    if (!fileName || !fileType) {
      return NextResponse.json(
        { message: 'No file info provided' },
        { status: 400 }
      );
    }

    const key = `${Date.now()}-${fileName.replace(/\s/g, '-')}`;

    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET!,
      Key: key,
      ContentType: fileType,
    });

    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    const publicUrl = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;

    return NextResponse.json({ presignedUrl, publicUrl });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Failed to get upload URL' },
      { status: 500 }
    );
  }
}
