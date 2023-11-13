'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { TypographyH2, TypographyP } from "@/components/typography"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Webcam from "react-webcam"

import { ObjectDetection, load as cocoModelLoad } from "@tensorflow-models/coco-ssd"
import { BlackSpinner } from '@/components/spinner';
import { capitalizeFirstLetter } from '@/lib/string';
import { RecyclableItemsFromCoco, howToRecycleItem } from '@/lib/detection';

import Confetti from 'react-confetti';
import { AddUserPoints } from '@/lib/auth/util';

export default function CaptureRecyclablePage () {
    const [objectDetector, setObjectDetectors] = useState<ObjectDetection | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true); 
    const [canSubmit, setCanSubmit] = useState<boolean>(false);

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    
    const [detectedObjects, setDetectedObjects] = useState<any[]>([]); // [ { bbox: [x, y, width, height], class: string, score: number } ]
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    const [howToRecycleItemResponse, setHowToRecycleItemResponse] = useState<string>('');

    const [rewardedPoints, setRewardedPoints] = useState<number>(0);

    const [recyclableItem, setRecyclableItem] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    const [windowWidth, setWindowWidth] = useState<number>(0);
    const [windowHeight, setWindowHeight] = useState<number>(0);

    const loadOCRModel = async () => {
        const model = await cocoModelLoad();
        setObjectDetectors(model);
        
        if (!isSubmitting) {
            setIsLoading(false);
        
        }
    };

    const detect = async () => {
        if (objectDetector && webcamRef.current && canvasRef.current) {
            objectDetector.detect(webcamRef.current.video as HTMLVideoElement).then((detections) => {
                setDetectedObjects(detections);

                // Draw the detections on the canvas
                
                if (webcamRef.current && canvasRef.current) {
                    const canvas = canvasRef.current as HTMLCanvasElement;
                    const ctx = canvas.getContext('2d');
                    canvas.width =  webcamRef.current.video?.videoWidth as number;
                    canvas.height = webcamRef.current.video?.videoHeight as number;
                    
                    if (ctx) {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.font = '10px Arial';

                        // Filter out detections with low confidence and persons

                        detections = detections.filter((detection) => {
                            return detection.score > 0.5 && RecyclableItemsFromCoco.includes(detection.class);
                        });

                        // Decide whether to enable the submit button

                        if (detections.length > 0) {
                            setCanSubmit(true);

                            // Set the Recyclable Item
                            setRecyclableItem(capitalizeFirstLetter(detections[0].class));
                        } else {
                            setCanSubmit(false);
                        }
                    

                        detections.forEach((detection) => {

                            const [x, y, width, height] = detection.bbox;
                            const text = detection.class;
                            const score = detection.score;

                            // Draw detections
                            ctx.beginPath();
                            ctx.rect(x, y, width, height);
                            ctx.strokeStyle = '#00FF00';
                            ctx.lineWidth = 1;
                            ctx.stroke();
                            ctx.closePath();

                            // Draw text background
                            ctx.beginPath();
                            ctx.rect(x, y, ctx.measureText(text).width + 4, 14);
                            ctx.fillStyle = '#00FF00';
                            ctx.fill();
                            ctx.closePath();

                            // Draw text
                            ctx.fillStyle = '#000000';
                            ctx.fillText(text + ' ' + (score * 100).toFixed(2) + '%', x, y + 10);
                        });
                    }
                }
                
            });
        }
    }

    function getHowToRecycle(recyclableItem: string) {
        setIsLoading(true);

        const res = howToRecycleItem(recyclableItem);
        
        if (res) {
            setHowToRecycleItemResponse(res);

            // Set the description
            setDescription(res);

            // Set the rewarded points

            if (res.toLowerCase().includes('recycle')) {
                setRewardedPoints(10);
                AddUserPoints(10);
            } else if (res.toLowerCase().includes('reuse')) {
                setRewardedPoints(5);
                AddUserPoints(5);
            } else if (res.toLowerCase().includes('compost')) {
                setRewardedPoints(5);
                AddUserPoints(5);
            } else {
                setRewardedPoints(0);
            }
        } else {
            setHowToRecycleItemResponse('This item might not be recyclable.');
        }
        setIsLoading(false);
        
    }
  
    useEffect(() => {
        loadOCRModel();
        
        let interval: NodeJS.Timeout | null = null;

        window.addEventListener('resize', () => {
            setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight);
        });

        setWindowWidth(window.innerWidth);
        setWindowHeight(window.innerHeight);

        if (objectDetector) {
            interval = setInterval(() => {
                detect();
            }, 200);
        }

        return () => {
            if (objectDetector) {
                //objectDetector.dispose();
                //clearInterval(interval as NodeJS.Timeout);
            }
        }
    }, [objectDetector]);

    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center">
            <Confetti 
            width={windowWidth}
            height={windowHeight}
            numberOfPieces={rewardedPoints > 0 ? 80 : 0}
            recycle={false}
            />
            <div className={'flex flex-col items-center w-full max-w-md gap-8'}>
                <div className={'flex flex-col items-center justify-center'}>
                    <TypographyP>
                        Upload a picture of the recyclable item
                        and we'll award you points for recycling! You
                        can redeem these points for prizes.
                    </TypographyP>
                    {
                        isSubmitting ? (
                            <div className={'flex flex-col gap-4 items-center w-full mt-4 border-dashed border p-4 backdrop-blur-lg rounded-md border-green-500'}>
                                {
                                    isLoading ? (
                                        <div className={'flex flex-col gap-2 items-center w-full'}>
                                            <BlackSpinner />
                                            <TypographyP className={'text-sm'}>
                                                Submitting...
                                            </TypographyP>
                                        </div>
                                    ) : (
                                        <div>
                                            {
                                                howToRecycleItemResponse ? (
                                                    <TypographyP className={''}>
                                                        {howToRecycleItemResponse}
                                                    </TypographyP>
                                                ) : (
                                                    <TypographyP className={'text-center'} >
                                                        We couldn't find any information about this item.
                                                    </TypographyP>
                                                )
                                            }

                                            {
                                                rewardedPoints > 0 ? (
                                                    <TypographyP className={'text-center mt-4 bg-green-300 py-2 rounded-md'}  >
                                                        You were rewarded {rewardedPoints} points!
                                                    </TypographyP>
                                                ) : (
                                                    <>
                                                    </>
                                                )
                                            }
                                        </div>
                                    )
                                }
                               
                            </div>
                        ) : (
                            <div className={'flex flex-col gap-4 w-full mt-4 border-dashed border p-4 backdrop-blur-lg rounded-md border-green-500'}>
                        <Input placeholder="Recyclable item (Optional)" 
                        value={recyclableItem}
                        onChange={(e) => {
                            setRecyclableItem(e.target.value);
                        }}
                        />
                        <Input placeholder="Description (Optional)"
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                        }}
                        />
                        
                        <div className={'relative pointer-events-none'}>
                            {
                                isLoading ? (
                                    <div className={'w-full h-full flex items-center justify-center py-4'}>
                                        <BlackSpinner />
                                    </div>
                                ) : (
                                    <>
                                        <Webcam ref={webcamRef} className={'rounded-md pointer-events-none'} audio={false} 
                                        
                                        />
                                        <canvas ref={canvasRef} 
                                        className={'absolute top-0 left-0 rounded-md'}
                                        />
                                    </>
                                )
                            }
                        </div>
                        
                        <Button
                        disabled={isLoading || !objectDetector || !canSubmit}
                        onClick={() => {
                            //detect();
                            setIsSubmitting(true);
                            getHowToRecycle(recyclableItem);
                        
                        }}
                        >
                            Capture
                        </Button>
                    </div>
                        )
                    }
                    
                </div>
                
            </div>
            
            
        </main>
    )
}